import React, { useState } from "react";
import Quiz from "./Quiz";

export default function QuizComponent({ tags, cards }) {
  const [numCards, setNumCards] = useState(0);
  const [start, setStart] = useState(false);
  const handleStartQuiz = () => {
    if (numCards <= 0) {
      alert("The number of cards must be >=1");
      setNumCards(0);
    }
    if (numCards > cards.length) {
      setNumCards(cards.length);
      setStart(!start);
    }
    if (numCards <= cards.length && numCards > 0) setStart(!start);
  };

  if (start) return <Quiz cards={cards} max={numCards} />;
  return (
    <div>
      <div className="m-2">
        <div style={{ display: "inline-block" }}>
          <label htmlFor="numOfCards">Number of cards:</label>
          <input
            style={{ marginLeft: "10px" }}
            type="number"
            id="numOfCards"
            value={numCards}
            onChange={(e) => setNumCards(Number(e.target.value))}
          />
        </div>
        <div
          style={{
            display: "inline-block",
            marginLeft: "10px",
          }}>
          /<b>{cards.length}</b>
        </div>
      </div>
      {/* <div>
        <label htmlFor="tags">Tags:</label>
        <select id="tags">
          <option value="all">All</option>
          <option value="noTag">No Tag</option>
          {tags.map((tag) => (
            <option key={tag + "`"} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div> */}

      {/* <div>
        <label htmlFor="rating">Rating:</label>
        <select id="rating">
          <option value="bad">Bad</option>
          <option value="normal">Normal</option>
          <option value="good">Good</option>
          <option value="unrated">Unrated</option>
        </select>
      </div> */}

      <button
        className="btn btn-warning btn-sm rounded-pill m-2"
        style={{ padding: "5px 8px 5px 8px" }}
        onClick={handleStartQuiz}>
        Start Quiz
      </button>
    </div>
  );
}
