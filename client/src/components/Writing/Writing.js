import { useEffect, useState } from "react";
import UnsuccessList from "./UnsuccessList";

export default function Writing({ cards, languages, maxNum }) {
  const [show, setShow] = useState(false);
  const [unsuccessCards, setUnsuccessCards] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const typeArr = cards.map((i) => ({
      original: i.name,
      translate: i.descriptions,
    }));

    const lang1 = typeArr.map(({ original, translate }) => ({
      original: original,
      translate: translate,
    }));
    lang1.sort(() => Math.random() - 0.4);

    if (languages) {
      const lang2 = typeArr.map(({ original, translate }) => ({
        original: translate,
        translate: original,
      }));
      setAllWords(lang1.concat(lang2).sort(() => 0.5 - Math.random()));
    } else {
      setAllWords(lang1.sort(() => 0.5 - Math.random()));
    }
  }, []);

  const checkUserAnswer = () => {
    if (allWords[currentIndex].translate.length >= 2) {
      if (!allWords[currentIndex].translate.includes(inputValue))
        setUnsuccessCards([
          ...unsuccessCards,
          { ...allWords[currentIndex], answer: inputValue },
        ]);
    } else {
      if (allWords[currentIndex].translate.toString() != inputValue)
        setUnsuccessCards([
          ...unsuccessCards,
          { ...allWords[currentIndex], answer: inputValue },
        ]);
    }
  };

  const handleNext = () => {
    checkUserAnswer();
    setInputValue("");
    setCurrentIndex(currentIndex + 1);
    if (currentIndex === allWords.length - 1) setShow(!show);
  };

  if (show)
    return <UnsuccessList unsuccessCards={unsuccessCards} setShow={setShow} />;

  return (
    allWords[currentIndex] && (
      <div style={{ margin: "5px" }}>
        <p>{allWords[currentIndex].original}</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="rounded"
          style={{
            background: "rgb(241, 180, 73)",
            border: "0",
            padding: "3px 8px 3px 8px",
            marginLeft: "3px",
          }}
          onClick={() => {
            if (inputValue.trim() == "") alert("Please, write an answer");
            else handleNext();
          }}>
          Next
        </button>
      </div>
    )
  );
}
