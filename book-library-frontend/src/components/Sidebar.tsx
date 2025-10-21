import React from "react";
import "../styles/Sidebar.css";

type Props = {
  onAddBookClick: () => void;
  onToggleFavorites?: () => void;
  onClearFilters?: () => void;
  onLogout: () => void;
  username?: string;
};

export default function Sidebar({ onAddBookClick, onToggleFavorites, onClearFilters, onLogout, username }: Props) {
  return (
    <aside className="sidebar">
      {username && (
        <div
        style={{
            marginBottom: "20px",
            fontWeight: "10",
            color: " #f3d4c786",
            textAlign: "center",
            fontSize: "50px",
          }}
        >
          Welcome, {username} 👋
        </div>
      )}
      <button className="sidebar__btn" onClick={onAddBookClick}>
        <b style={{ color: "rgb(0, 0, 0)" }}>➕ Add Book </b>
      </button>
      {onToggleFavorites && (
        <button type="button" className="sidebar__btn" onClick={onToggleFavorites}>
          <b style={{ color:"rgb(0, 0, 0)" }}>❤️ Favorites</b>
        </button>
      )}

      {onClearFilters && (
        <button className="sidebar__btn" onClick={onClearFilters}>
          <b style={{ color: "rgb(0, 0, 0)" }}>✨ Clear Filters </b>
        </button>
      )}
      <button
        onClick={onLogout}
        className="sidebar-btn logout-btn"
        style={{ backgroundColor: "#c62828", color: "white", marginTop: "10px" }}
      >
        Logout
      </button>
    </aside>
  );
}
