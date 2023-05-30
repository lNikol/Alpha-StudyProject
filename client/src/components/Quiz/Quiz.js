import { useEffect, useState } from "react";
import UnsuccessList from "../Writing/UnsuccessList";

export default function Quiz({ cards, max }) {
  const [quizArr, setQuizArr] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [show, setShow] = useState(false);
  const [unsuccessCards, setUnsuccessCards] = useState([]);

  useEffect(() => {
    let tArr = new Array(max);
    const typeArr = cards.map((i) => ({
      original: i.name,
      translate: i.descriptions,
    }));

    const lang1 = typeArr.map(({ original, translate }) => ({
      original: original,
      translate: translate,
    }));

    for (let i = 0; i < max; i++) tArr[i] = lang1[i];

    setQuizArr(tArr);
  }, []);

  const checkUserAnswer = () => {
    if (quizArr[currentIndex].translate.length >= 2) {
      if (quizArr[currentIndex].translate.includes(inputValue))
        console.log("good answer");
      else
        setUnsuccessCards([
          ...unsuccessCards,
          { ...quizArr[currentIndex], answer: inputValue },
        ]);
    } else {
      if (quizArr[currentIndex].translate.toString() != inputValue)
        setUnsuccessCards([
          ...unsuccessCards,
          { ...quizArr[currentIndex], answer: inputValue },
        ]);
    }
  };

  const handleNext = () => {
    checkUserAnswer();
    setCurrentIndex(currentIndex + 1);
    setInputValue("");
    if (currentIndex === quizArr.length - 1) setShow(true);
  };

  if (show)
    return <UnsuccessList unsuccessCards={unsuccessCards} setShow={setShow} />;

  return (
    quizArr[currentIndex] && (
      <div>
        <p>{quizArr[currentIndex].original}</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
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
