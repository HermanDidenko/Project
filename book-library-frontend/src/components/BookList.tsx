import React, { useState, useEffect } from "react";
import axios from "axios";
import type { Book } from "../types";
import "../styles/BookList.css";
import BookActions from "./BookActions";

type BookListProps = {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
};

export default function BookList({ books, onEdit, onDelete }: BookListProps) {
  const [bookList, setBookList] = useState<Book[]>(books);

  useEffect(() => {
    setBookList(books);
  }, [books]);

  const handleFavoriteClick = async (id: number) => {
    try {
      const response = await axios.patch(
        `http://localhost:5049/api/books/${id}/favorite`
      );
      console.log("SERVER RESPONSE:", response.data);
      const { isFavorite } = response.data;
      setBookList((prevBooks) =>
        prevBooks.map((b) =>
          b.id === id ? { ...b, isFavorite } : b
        )
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="book-list">
      {bookList.length > 0 ? (
        bookList.map((book) => (
          <div key={book.id} className="book-card">
            <button
              onClick={() => handleFavoriteClick(book.id)}
              className={`favorite-heart ${book.isFavorite ? "active" : ""}`}
              title={book.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {book.isFavorite ? "❤️" : "🤍"}
            </button>

            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Year:</strong> {book.year}</p>
            <p><strong>Publisher:</strong> {book.publisherName}</p>

            <BookActions
              onEdit={() => onEdit(book)}
              onDelete={() => onDelete(book.id)}
            />
          </div>
        ))
      ) : (
        <p className="no-books">No books found.</p>
      )}
    </div>
  );
}











