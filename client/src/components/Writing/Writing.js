import { useEffect, useState } from "react";
import UnsuccessList from "./UnsuccessList";

export default function Writing({ cards, start }) {
  // let [start, setStart] = useState(false);
  let [show, setShow] = useState(false);
  let [wrCards, setWrCards] = useState(cards); // [{original: original, translate:translate}]
  let [unsuccessCards, setUnsuccessCards] = useState([]);
  if (show)
    return <UnsuccessList unsuccess={unsuccessCards} setShow={setShow} />;
  const startWriting = (languages) => {
    let allWords = [];
    const typeArr = wrCards.map((i) => ({
      original: i.name,
      translate: i.descriptions,
    }));

    const lang1 = typeArr.map(({ original, translate }) => ({
      original,
      translate,
    }));
    if (languages) {
      const lang2 = typeArr.map(({ original, translate }) => ({
        original: translate.toString(),
        translate: original,
      }));

      console.log(lang1);
      console.log(lang2);
      console.log(typeArr);
    }
  };
  return (
    <>
      <form>
        <input id="languages" type="checkbox" />
        <label htmlFor="languages">Two languages?</label>
      </form>

      {wrCards.map((c) => (
        <p key={c.name + "-"}>
          {c.name}
          {"  "}
          {c.descriptions.map((d, index) => (
            <b key={"d" + index + "-"}>{d}</b>
          ))}
        </p>
      ))}
      <button
        onClick={() => {
          let languages = document.getElementById("languages").checked;
          startWriting(languages);
        }}>
        Start
      </button>
    </>
  );
}
