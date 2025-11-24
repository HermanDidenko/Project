import React, { useState } from "react";
import { searchFreeBooks } from "../services/AiService";
import { searchBuyBooks } from "../services/BuyBookService";
import { fetchBookCover } from "../services/GoogleBooksService";
import "../styles/AiBookFinder.css";

type FreeBook = {
  title: string;
  author: string;
  genre: string;
  publisher: string;
  year: number;
  pages: number;
  link: string;
  cover?: string | null;
};

type BuyBook = {
  title: string;
  author: string;
  price: string;
  store: string;
  storeLink: string;
  rating?: string;
  genre?: string;
  publisher?: string;
  year?: number;
  cover?: string | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AiBookFinder: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<"free" | "buy">("free");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [freeBooks, setFreeBooks] = useState<FreeBook[]>([]);
  const [buyBooks, setBuyBooks] = useState<BuyBook[]>([]);
  const [rawResponse, setRawResponse] = useState<string>("");

  // PARSERS
  const parseFreeBooks = (text: string): FreeBook[] => {
    // format: Title | Author | Genre | Publisher | Year | Pages | Link
    return text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.includes("|"))
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        return {
          title: parts[0] || "Unknown Title",
          author: parts[1] || "Unknown Author",
          genre: parts[2] || "Unknown Genre",
          publisher: parts[3] || "Unknown Publisher",
          year: Number(parts[4]) || 0,
          pages: Number(parts[5]) || 0,
          link: parts[6] || "",
        };
      });
  };

  const parseBuyBooks = (text: string): BuyBook[] => {
    // format: Title | Author | Price | Store | StoreLink | Rating | Genre | Publisher | Year
    return text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.includes("|"))
      .map((line) => {
        const p = line.split("|").map((x) => x.trim());
        return {
          title: p[0] || "Unknown Title",
          author: p[1] || "Unknown Author",
          price: p[2] || "—",
          store: p[3] || "Unknown Store",
          storeLink: p[4] || "",
          rating: p[5] || undefined,
          genre: p[6] || undefined,
          publisher: p[7] || undefined,
          year: Number(p[8]) || undefined,
        };
      });
  };

  // SEARCH HANDLERS
  const handleSearchFree = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setFreeBooks([]);
    setRawResponse("");
    try {
      const resp = await searchFreeBooks(query);
      // resp may be raw string or object with choices
      const text =
        resp?.choices?.[0]?.message?.content ||
        resp?.choices?.[0]?.text ||
        (typeof resp === "string" ? resp : JSON.stringify(resp));
      setRawResponse(text);
      const parsed = parseFreeBooks(text);

      // fetch covers in parallel (but sequential to avoid rate issues)
      for (const b of parsed) {
        try {
          b.cover = await fetchBookCover(b.title, b.author);
        } catch {
          b.cover = undefined;
        }
      }

      setFreeBooks(parsed);
    } catch (err) {
      console.error("Free search error", err);
      alert("Error searching free books");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchBuy = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setBuyBooks([]);
    setRawResponse("");
    try {
      const resp = await searchBuyBooks(query);
      const text =
        resp?.choices?.[0]?.message?.content ||
        resp?.choices?.[0]?.text ||
        (typeof resp === "string" ? resp : JSON.stringify(resp));
      setRawResponse(text);
      const parsed = parseBuyBooks(text);

      for (const b of parsed) {
        try {
          b.cover = await fetchBookCover(b.title, b.author);
        } catch {
          b.cover = undefined;
        }
      }

      setBuyBooks(parsed);
    } catch (err) {
      console.error("Buy search error", err);
      alert("Error searching buy books");
    } finally {
      setLoading(false);
    }
  };

  // ADD TO LIBRARY (simple)
  const addToLibrary = async (item: FreeBook | BuyBook) => {
    const payload: any = {
      title: item.title,
      author: item.author,
      year: (item as any).year || 0,
      genre: (item as any).genre || "AI Suggestion",
      pages: (item as any).pages || 0,
      isFavorite: false,
      publisherId: null,
    };

    try {
      await fetch("http://localhost:5049/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert(`"${item.title}" added to library`);
    } catch (err) {
      console.error("Add to library error", err);
      alert("Failed to add book");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ai-close" onClick={onClose}>
          ✖
        </button>

        <h2 className="ai-title">AI Book Finder</h2>

        <div className="ai-tabs">
          <button
            className={`ai-tab ${tab === "free" ? "active" : ""}`}
            onClick={() => setTab("free")}
          >
            Free Books
          </button>
          <button
            className={`ai-tab ${tab === "buy" ? "active" : ""}`}
            onClick={() => setTab("buy")}
          >
            Buy Books
          </button>
        </div>

        <div className="ai-search-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              tab === "free"
                ? "Search free/readable books (topic, title, author)..."
                : "Search books to buy (title, author, store)..."
            }
            className="ai-input"
          />

          <button
            onClick={tab === "free" ? handleSearchFree : handleSearchBuy}
            className="ai-search-btn"
          >
            Search
          </button>
        </div>

        {loading && <p className="ai-loading">Searching...</p>}

        {/* RESULTS */}
        {tab === "free" && (
          <>
            <h3>Suggested Free Books:</h3>
            <div className="ai-cards">
              {freeBooks.length === 0 && !loading && (
                <p className="ai-empty">No results yet</p>
              )}
              {freeBooks.map((b, i) => (
                <div className="ai-card" key={i}>
                  {b.cover ? (
                    <img src={b.cover} alt={b.title} className="ai-cover" />
                  ) : (
                    <div className="ai-no-cover">No cover</div>
                  )}

                  <div className="ai-book-info">
                    <h3 className="ai-book-title">{b.title}</h3>
                    <p className="ai-book-author">by {b.author}</p>
                    <p className="ai-book-meta">Genre: {b.genre}</p>
                    <p className="ai-book-meta">Publisher: {b.publisher}</p>

                    {b.link ? (
                      <a
                        href={b.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ai-book-link"
                      >
                        📖 Open Book
                      </a>
                    ) : (
                      <p className="ai-no-link">No link</p>
                    )}

                    <div className="ai-actions">
                      <button
                        className="ai-add-btn"
                        onClick={() => addToLibrary(b)}
                      >
                        ➕ Add to Library
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "buy" && (
          <>
            <h3>Buyable Books:</h3>
            <div className="ai-cards">
              {buyBooks.length === 0 && !loading && (
                <p className="ai-empty">No results yet</p>
              )}

              {buyBooks.map((b, i) => (
                <div className="ai-card" key={i}>
                  {b.cover ? (
                    <img src={b.cover} alt={b.title} className="ai-cover" />
                  ) : (
                    <div className="ai-no-cover">No cover</div>
                  )}

                  <div className="ai-book-info">
                    <h3 className="ai-book-title">{b.title}</h3>
                    <p className="ai-book-author">by {b.author}</p>
                    <p className="ai-book-meta">Store: {b.store}</p>
                    <p className="ai-book-meta">Price: {b.price}</p>
                    {b.rating && <p className="ai-book-meta">Rating: {b.rating}</p>}

                    {b.storeLink ? (
                      <a
                        href={b.storeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ai-book-link"
                      >
                        Buy →
                      </a>
                    ) : (
                      <p className="ai-no-link">No store link</p>
                    )}

                    <div className="ai-actions">
                      <button
                        className="ai-add-btn"
                        onClick={() => addToLibrary(b)}
                      >
                        ➕ Add to Library
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* raw response (collapse for debug) */}
        {rawResponse && (
          <details style={{ marginTop: 12 }}>
            <summary>Raw AI response</summary>
            <pre style={{ whiteSpace: "pre-wrap" }}>{rawResponse}</pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default AiBookFinder;
