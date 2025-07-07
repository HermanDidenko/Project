import React from "react";

const BookActions = ({ onEdit, onDelete }) => (
    <div className="book-actions">
        <button onClick={onEdit} className="edit" >Edit</button>
        <button onClick={onDelete} className="delete">Delete</button>
    </div>
);

export default BookActions;
