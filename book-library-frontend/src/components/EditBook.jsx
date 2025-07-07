import React, { useState } from "react";

function EditBook({ book, onUpdate, onCancel }) {
    const [title, setTitle] = useState(book.title);
    const [author, setAuthor] = useState(book.author);
    const [year, setYear] = useState(book.year);
    const [genre, setGenre] = useState(book.genre);
    const [pages, setPages] = useState(book.pages);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({ ...book, title, author, year, genre, pages});
    };
    
    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <h3>Edit Book</h3>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
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
            <button type="submit">Update</button>
            <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
                Cancel
            </button>
        </form>
    );
}

export default EditBook;
