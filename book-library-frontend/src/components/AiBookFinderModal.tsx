import React from "react";
import AiBookFinder from "./AiBookFinder";
import "../styles/AiModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AiBookFinderModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="ai-overlay" onClick={onClose}>
      <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>

        <AiBookFinder onClose={onClose} isOpen/>
      </div>
    </div>
  );
}
