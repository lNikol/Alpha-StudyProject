import React from "react";

export default function Quiz({ tags, cards }) {
  const handleStartQuiz = () => {};

  return (
    <div>
      <div>
        <div style={{ display: "inline-block", fontSize: "20px" }}>
          <label htmlFor="numOfCards">Number of cards:</label>
          <input
            style={{ marginLeft: "10px" }}
            type="text"
            id="numOfCards"
            value=""
          />
        </div>
        <div
          style={{
            display: "inline-block",
            marginLeft: "10px",
            fontSize: "20px",
          }}>
          /<b>{cards.length}</b>
        </div>
      </div>
      <div>
        <label htmlFor="tags">Tags:</label>
        <select id="tags">
          <option value="all">All</option>
          <option value="noTag">No Tag</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="rating">Rating:</label>
        <select id="rating">
          <option value="bad">Bad</option>
          <option value="normal">Normal</option>
          <option value="good">Good</option>
          <option value="unrated">Unrated</option>
        </select>
      </div>

      <button onClick={handleStartQuiz}>Start Quiz</button>
    </div>
  );
}
