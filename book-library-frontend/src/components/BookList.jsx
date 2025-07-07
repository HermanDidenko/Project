
import React from "react";
import BookActions from "./BookActions"; // подключение
import "./BookList.css";

function BookList({ books, onEdit, onDelete }) {
    return (
        <div className="book-list">
            {books.length > 0 ? (
                books.map((book) => (
                    <div className="book-card" key={book.id}>
                        <h3>{book.title}</h3>
                        <p><strong>Author:</strong> {book.author}</p>
                        <p><strong>Genre:</strong> {book.genre}</p>
                        <p><strong>Year:</strong> {book.year}</p>
                        <p><strong>Pages:</strong> {book.pages}</p>

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

export default BookList;






