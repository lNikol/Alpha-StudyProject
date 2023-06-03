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
          <h2>
            {userNameDb}: {set.studyName}
          </h2>
        </div>
      ) : (
        ""
      )}
      <ul className="list-group list-group-horizontal-sm">
        <li className="list-group-item list-group-item-primary">{item.name}</li>
        <li className="list-group-item list-group-item-secondary">
          {item.descriptions.toString().split(",").join("/")}
        </li>
        <li className="list-group-item list-group-item-success">
          {item.tags.toString().split(",").join("/")}
        </li>
      </ul>
    </>
  );
}
