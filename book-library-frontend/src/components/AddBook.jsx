
import React, { useState } from "react";
import axios from "axios";

function AddBook({ onBookAdded }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [year, setYear] = useState("");
    const [genre, setGenre] = useState("");
    const [pages, setPages] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("http://localhost:5049/api/books", {
            title,
            author,
            year: parseInt(year),
            genre,
            pages: parseInt(pages)
        })
            .then(() => {
                setTitle("");
                setAuthor("");
                onBookAdded(); // обновить список
            })
            .catch((err) => console.error("Ошибка при добавлении книги:", err));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Pages"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                required
            />

            <button type="submit">Add Book</button>
        </form>
    );
}

export default AddBook;


