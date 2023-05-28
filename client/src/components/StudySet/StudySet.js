import { useEffect, useState } from "react";
import Card from "../Card/Card";
import Quiz from "../Quiz/Quiz";
import Writing from "../Writing/Writing";

export default function StudySet({ name, cards }) {
  let [quiz, setQuiz] = useState(false);
  let [writing, setWriting] = useState(false);
  let [writingShow, setWritingShow] = useState(false);
  let [allTags, setAllTags] = useState([]);
  useEffect(() => {
    cards.map((i) => {
      i.tags.map((d) => {
        if (!allTags.includes(d)) allTags.push(d);
      });
    });
  }, []);

  const startQuiz = () => {
    setQuiz(!quiz);
  };

  const startWriting = () => {
    // setWriting(!writing);
    setWritingShow(!writingShow);
  };
  if (writing) return <Writing cards={cards} start={false} />;
  return (
    <div style={{ marginLeft: "5px" }}>
      <b>{name}</b>
      {cards.map((i, index) => (
        <div
          key={index + "_"}
          style={{
            margin: "10px",
            border: "1px solid blue",
            width: "200px",
            // display: "grid",
            // gridTemplateColumns: "200px 200px 200px",
          }}>
          <Card key={i + index} {...i} />
        </div>
      ))}
      <button style={{ margin: "15px" }} onClick={startQuiz}>
        Quiz
      </button>
      <button style={{ margin: "15px" }} onClick={startWriting}>
        Writing
      </button>
      {quiz == true ? <Quiz tags={allTags} cards={cards} /> : ""}
      {writingShow == true ? <Writing cards={cards} start={setWriting} /> : ""}
    </div>
  );
}
