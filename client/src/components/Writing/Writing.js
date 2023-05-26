import { useEffect, useState } from "react";
import userApi from "../../http";
import UnsuccessList from "./UnsuccessList";

export default function Writing(username) {
  let [start, setStart] = useState(false);
  let [show, setShow] = useState(false);
  let [wrCards, setWrCards] = useState([]); // [{original: original, translate:translate}]
  let [unsuccessCards, setUnsuccessCards] = useState([]);
  useEffect(() => {
    userApi
      .post("/cards", username)
      .then((res) => setWrCards(res.data))
      .catch((e) => console.log(e.message));
  }, []);
  if (show)
    return <UnsuccessList unsuccess={unsuccessCards} setShow={setShow} />;

  return (
    <>
      {wrCards.map((c) => (
        <p key={c.name}>
          {c.name}
          {"  "}
          {c.descriptions.map((d) => (
            <b key="d">{d}</b>
          ))}
        </p>
      ))}
    </>
  );
}
