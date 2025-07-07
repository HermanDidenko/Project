
import React, { useEffect, useState } from "react";
import axios from "axios";
import BookList from "./components/BookList"; // или просто рендер без компонента
import EditBook from "./components/EditBook";
import "./App.css";


function App() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [editingBook,setEditingBook] = useState(null);
    const [formData ,setFormData] = useState({
        title: "",
        author: "",
        genre: "",
        year: "",
        pages: ""
    });
    const [page, setPage] = useState(1);
    const pageSize = 5; // или 10 — как хочешь

    const fetchBooks = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (sortOption) params.append("sort", sortOption);
        if (setPage) params.append("page", page);
        if (pageSize) params.append("pageSize", pageSize);

        axios
            .get(`http://localhost:5049/api/books?${params.toString()}`)
            .then((res) => setBooks(res.data))
            .catch((err) => console.error("Ошибка при получении книг:", err));
    };

    // Вызывается один раз при старте
    useEffect(() => {
        fetchBooks();
    }, [searchTerm, sortOption, formData, page]);

    // Обработка формы
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchBooks(); // вызывает фильтр
    };
    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            genre: book.genre,
            year: book.year,
            pages: book.pages
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Удалить книгу?")) {
            axios.delete(`http://localhost:5049/api/books/${id}`)
                .then(() => fetchBooks())
                .catch((err) => console.error("Ошибка при удалении:", err));
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Book Library</h1>

            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "6px", marginRight: "10px" }}
                />
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{ padding: "6px", marginRight: "10px" }}
                >
                    <option value="">Sort by...</option>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="year">Year</option>
                    <option value="genre">Genre</option>
                    <option value="pages">Pages</option>
                </select>
                <button type="submit" style={{ padding: "6px 12px" }}>
                    Search
                </button>
            </form>
            <BookList
                books={books}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />{editingBook && (
                <EditBook className="edit-book-container"
                    book={editingBook}
                    onUpdate={(updatedBook) => {
                        axios
                            .put(`http://localhost:5049/api/books/${updatedBook.id}`, {
                                ...updatedBook,
                                year: parseInt(updatedBook.year),
                                pages: parseInt(updatedBook.pages)
                            })
                            .then(() => {
                                setEditingBook(null);
                                fetchBooks();
                            })
                            .catch((err) =>
                                console.error("Ошибка при обновлении книги:", err)
                            );
                    }}
                    onCancel={() => setEditingBook(null)}
                />
            )}
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    style={{ marginRight: "10px" }}
                >
                    ← Previous
                </button>
                <button onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
        </div>
    );
}

export default App;




