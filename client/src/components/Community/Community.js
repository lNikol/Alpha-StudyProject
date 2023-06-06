import { useEffect, useState } from "react";
import userApi from "../../http";
import CommunityBlock from "./CommunityBlock";

export default function Community() {
  let [sets, setSets] = useState([]);
  useEffect(() => {
    userApi.post("/communityCards").then((res) => {
      setSets(res.data);
    });
  }, []);

  return (
    <div
      style={{
        overflow: "auto",
        maxHeight: "700px",
      }}>
      {sets.map((i) =>
        i.cards.map((c, index) => (
          <div key={index + "op"}>
            <CommunityBlock index={index} set={i} item={c} />
          </div>
        ))
      )}
    </div>
  );
}

<div className="container">
  <div className="card my-4">
    <div className="card-header bg-dark text-white">
      <h2>Заголовок блока</h2>
    </div>
    <div className="card-body">
      <ul className="list-group">
        <li className="list-group-item">Элемент списка 1</li>
        <li className="list-group-item">Элемент списка 2</li>
        <li className="list-group-item">Элемент списка 3</li>
      </ul>
    </div>
  </div>
</div>;
