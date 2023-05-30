import { useEffect, useState } from "react";
import userApi from "../../http";

export default function Community() {
  let [cards, setCards] = useState([]);
  useEffect(() => {
    userApi.post("/communityCards").then((res) => {
      setCards(res.data);
    });
  }, []);
  return (
    <div style={{ margin: "5px" }}>
      {cards.map((i) =>
        i.cards.map((c, index) => (
          <div key={index + ","}>
            {index == 0 ? (
              <div>
                {i.cards[index]?.user}: <b>{i.studyName}</b>
              </div>
            ) : (
              ""
            )}
            <p>
              {c.name} <b>{c.descriptions.toString().split(",").join("/")}</b>{" "}
              <i>{c.tags.toString().split(",").join("/")}</i>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
