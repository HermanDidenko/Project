import React from "react";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function BookActions({ onEdit, onDelete }: Props) {
  return (
    <div className="book-actions">
      <button type="button" onClick={onEdit} className="edit">Edit</button>
      <button type="button" onClick={onDelete} className="delete">Delete</button>
    </div>
  );
}
