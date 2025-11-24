import React from "react";
import "../styles/Sidebar.css";

type Props = {
  onAddBookClick: () => void;
  onToggleFavorites?: () => void;
  onClearFilters?: () => void;
  onLogout: () => void;
  onOpenAiFinder: () => void;
  isOpen: boolean;
  onClose: () => void;
  username?: string;
};

export default function Sidebar({
  onAddBookClick,
  onToggleFavorites,
  onClearFilters,
  onLogout,
  onOpenAiFinder,
  isOpen,
  onClose,
  username,
}: Props) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* CLOSE BUTTON */}
      <button className="sidebar__close" onClick={onClose}>
        ✕
      </button>

      {/* Username */}
      {username && (
        <div
          style={{
            marginBottom: "20px",
            fontWeight: "10",
            color: "#f3d4c786",
            textAlign: "center",
            fontSize: "28px",
          }}
        >
          Welcome, {username} 👋
        </div>
      )}

      {/* Add Book */}
      <button
        className="sidebar__btn"
        onClick={() => {
          onAddBookClick();
          onClose();
        }}
      >
        <b style={{ color: "#000" }}>➕ Add Book</b>
      </button>

      {/* Favorites */}
      {onToggleFavorites && (
        <button
          className="sidebar__btn"
          onClick={() => {
            onToggleFavorites();
            onClose();
          }}
        >
          <b style={{ color: "#000" }}>❤️ Favorites</b>
        </button>
      )}

      {/* Clear Filters */}
      {onClearFilters && (
        <button
          className="sidebar__btn"
          onClick={() => {
            onClearFilters();
            onClose();
          }}
        >
          <b style={{ color: "#000" }}>✨ Clear Filters</b>
        </button>
      )}

      {/* AI Finder */}
      <button
        className="sidebar__btn"
        onClick={() => {
          onOpenAiFinder();
          onClose();
        }}
      >
        <b style={{ color: "#000" }}>🤖 AI Book Finder</b>
      </button>

      {/* Logout */}
      <button
        onClick={() => {
          onLogout();
          onClose();
        }}
        className="sidebar-btn logout-btn"
        style={{
          backgroundColor: "#c62828",
          color: "white",
          marginTop: "10px",
        }}
      >
        Logout
      </button>
    </aside>
  );
}
