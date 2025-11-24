import React, { useEffect, useState } from "react";
import type { Book, Publisher } from "../types";
import { fetchPublishers } from "../services/publisherService";
import "../styles/EditBook.css";

type Props = {
  book: Book;
  onUpdate: (book: Book) => void;
  onCancel: () => void;
};

export default function EditBook({ book, onUpdate, onCancel }: Props) {
  const [title, setTitle] = useState<string>(book.title);
  const [author, setAuthor] = useState<string>(book.author);
  const [year, setYear] = useState<number>(book.year);
  const [genre, setGenre] = useState<string>(book.genre);
  const [pages, setPages] = useState<number>(book.pages);

  const [publisherId, setPublisherId] = useState<number | "">(
    book.publisherId ?? ""
  );
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loadingPub, setLoadingPub] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingPub(true);
        const list = await fetchPublishers();
        setPublishers(list);
      } catch (e) {
        console.error("Failed to load publishers:", e);
      } finally {
        setLoadingPub(false);
      }
    })();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate({
      ...book,
      title,
      author,
      year,
      genre,
      pages,
      publisherId: publisherId === "" ? null : Number(publisherId),
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // клик по форме не закрывает модалку
      >
        <form onSubmit={handleSubmit} className="edit-book-form">
          <h2>Edit Book</h2>

          <div className="form-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Title"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              placeholder="Author"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
              placeholder="Year"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
              placeholder="Genre"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              required
              placeholder="Pages"
            />
          </div>

          <div className="form-group" style={{ marginLeft: 25 }}>
            <select
              value={publisherId}
              onChange={(e) => {
                const v = e.target.value;
                setPublisherId(v === "" ? "" : Number(v));
              }}
              disabled={loadingPub}
            >
              <option value="">— No Publisher —</option>
              {publishers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              Update
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

