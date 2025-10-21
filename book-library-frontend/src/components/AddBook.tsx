import React, { useState, useEffect } from "react";
import axios from "axios";
import type { Book, Publisher } from "../types";
import { fetchPublishers } from "../services/publisherService";
import "../styles/AddBook.css";

type AddBookProps = {
  onBookAdded: () => void;
  onClose: () => void;
};

export default function AddBook({ onBookAdded, onClose }: AddBookProps) {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [pages, setPages] = useState<string>("");

  const [publisherId, setPublisherId] = useState<number | "">("");
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loadingPub, setLoadingPub] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingPub(true);
        const list = await fetchPublishers();
        setPublishers(list);
      } catch (e) {
        console.error("Can't load publishers:", e);
      } finally {
        setLoadingPub(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post<Book>("http://localhost:5049/api/books", {
        title,
        author,
        year: parseInt(year, 10),
        genre,
        pages: parseInt(pages, 10),
        isFavorite: false,
        publisherId: publisherId === "" ? null : Number(publisherId),
      });

      setTitle("");
      setAuthor("");
      setYear("");
      setGenre("");
      setPages("");
      setPublisherId("");

      onBookAdded();
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="add-book-form">
          <h2>Add a New Book</h2>

          <div className="form-group">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Pages"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              required
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
              <option value="">Select Publisher...</option>
              {publishers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit">Add Book</button>
            <button type="button" className="close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}