import { useEffect, useState } from "react";
import userApi from "../../http";

export default function CommunityBlock({ index, set, item }) {
  const [userNameDb, setUserNameDb] = useState("");

  useEffect(() => {
    userApi
      .post("/userById", { userId: set.cards[index]?.user })
      .then((res) => {
        setUserNameDb(res.data);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <>
      {index == 0 ? (
        <div className="card-header">
          <h2 style={{ marginTop: "10px" }}>
            {userNameDb}: {set.studyName}
          </h2>
        </div>
      ) : (
        ""
      )}
      <ul
        className="list-group list-group-horizontal-sm"
        style={{ marginTop: "10px" }}>
        <li className="list-group-item" style={{ background: "lightgray" }}>
          {item.name}
        </li>
        {item.descriptions.map((i) => (
          <li
            key={i + set}
            className="list-group-item"
            style={{ background: "#F0F0F0" }}>
            {i}
          </li>
        ))}
        {item.tags.map((i) => (
          <li
            key={i + set}
            className="list-group-item"
            style={{ background: "#F1B449" }}>
            {i}
          </li>
        ))}
      </ul>
    </>
  );
}
