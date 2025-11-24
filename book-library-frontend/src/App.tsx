import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AddBook from "./components/AddBook";
import BookList from "./components/BookList";
import EditBook from "./components/EditBook";
import "./styles/App.css";
import { fetchPublishers } from "./services/publisherService";
import type { Book } from "./types";
import Sidebar from "./components/Sidebar";
import Login from "./Login";
import Register from "./Register";
import AiBookFinderModal from "./components/AiBookFinderModal";

type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [publishers, setPublishers] = useState<{ id: number; name: string }[]>([]);
  const [publisherIdFilter, setPublisherIdFilter] = useState<number | "">("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [favoriteOnly, setFavoriteOnly] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("jwt"));
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );

  const pageSize = 6;

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername(null);
  };

  const handleToggleFavorites = () => {
    setFavoriteOnly((prev) => !prev);
    setPage(1);
    fetchBooks();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSortOption("");
    setPublisherIdFilter("");
    setFavoriteOnly(false);
    setPage(1);
    fetchBooks();
  };

  useEffect(() => {
    axios
      .get("http://localhost:5049/api/publishers")
      .then((res) => setPublishers(res.data))
      .catch((err) => console.error("Error loading publishers:", err));
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      const params: Record<string, any> = {
        search: searchTerm || undefined,
        sort: sortOption || undefined,
        page,
        pageSize,
        favoriteOnly: favoriteOnly || undefined,
        publisherId: publisherIdFilter || undefined,
      };
      const { data } = await axios.get<PagedResult<Book>>("http://localhost:5049/api/books", { params });
      setBooks(data.items);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  }, [searchTerm, sortOption, page, pageSize, favoriteOnly, publisherIdFilter]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await axios.delete(`http://localhost:5049/api/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  // Login/register screens
  if (!isLoggedIn) {
    return showRegister ? (
      <Register onRegisterSuccess={() => setShowRegister(false)} />
    ) : (
      <div className="login">
        <Login onLogin={() => setIsLoggedIn(true)} />
        <p className="register" style={{ textAlign: "center", marginTop: 10 }}>
          Don't have an account?{" "}
          <button
            onClick={() => setShowRegister(true)}
            style={{
              background: "none",
              color: "blue",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Register here
          </button>
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>

      {/* Burger button (hidden when sidebar open) */}
      {!isSidebarOpen && (
        <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
          ☰
        </button>
      )}

      {/* Sidebar */}
      <Sidebar
        onAddBookClick={() => setShowAddForm(true)}
        onToggleFavorites={handleToggleFavorites}
        onClearFilters={handleClearFilters}
        onLogout={handleLogout}
        onOpenAiFinder={() => setIsAiOpen(true)}
        username={username ?? ""}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div style={{ marginLeft: 240, padding: 20, width: "100%" }}>

        <h1>Book Library</h1>

        <form className="search-form" onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: 6,
              marginRight: 10,
              backgroundColor: "#f3d4c7",
              border: "2px solid",
            }}
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: 6,
              marginRight: 10,
              backgroundColor: "#f3d4c7",
              border: "2px solid",
            }}
          >
            <option value="">Sort by...</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="year">Year</option>
            <option value="genre">Genre</option>
            <option value="pages">Pages</option>
          </select>

          <select
            value={publisherIdFilter}
            onChange={(e) => {
              const v = e.target.value;
              setPage(1);
              setPublisherIdFilter(v ? Number(v) : "");
            }}
            style={{
              padding: 6,
              marginRight: 10,
              backgroundColor: "#f3d4c7",
              border: "2px solid",
            }}
          >
            <option value="">Select Publisher...</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button type="submit" style={{ padding: "6px 12px" }}>
            Search
          </button>
        </form>

        {showAddForm && <AddBook onBookAdded={fetchBooks} onClose={() => setShowAddForm(false)} />}

        <BookList books={books} onEdit={handleEdit} onDelete={handleDelete} />

        {editingBook && (
          <EditBook
            book={editingBook}
            onUpdate={async (updatedBook) => {
              try {
                await axios.put(`http://localhost:5049/api/books/${updatedBook.id}`, {
                  ...updatedBook,
                  year: Number(updatedBook.year),
                  pages: Number(updatedBook.pages),
                });
                setEditingBook(null);
                fetchBooks();
              } catch (err) {
                console.error("Error updating book:", err);
              }
            }}
            onCancel={() => setEditingBook(null)}
          />
        )}

        <AiBookFinderModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={{ marginRight: 10 }}
          >
            ← Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={books.length < pageSize}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
