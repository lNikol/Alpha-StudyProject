import { Link } from "react-router-dom";
import { useState } from "react";
import userApi from "../../http";

export default function StudySetGrid({ studySets, setter }) {
  const [studySet, setStudySet] = useState(false);
  const [studyValue, setStudyValue] = useState("");

  const sendSet = () => {
    userApi
      .post("/studyset/createSet", { studysetName: studyValue.trim() })
      .then((res) => setter(res.data))
      .catch((err) => {
        alert(err.response.data.message);
      });
    setStudyValue("");
    setStudySet(!studySet);
  };

  return (
    <>
      <div>
        <button
          className="btn btn-warning"
          onClick={() => setStudySet(!studySet)}>
          Create Set
        </button>
      </div>

      {studySet == true ? (
        <div>
          <input
            type="text"
            value={studyValue}
            onChange={(e) => setStudyValue(e.target.value)}></input>
          <button onClick={sendSet}>Create</button>
        </div>
      ) : (
        ""
      )}

      {studySets.map((i, index) => (
        <Link
          className="nav-link p-3 m-3 text-center rounded border border-primary"
          style={{ maxWidth: `45%` }}
          key={index + "link"}
          to={`/studysets/${i.name}`}>
          <h4>{i.name}</h4>
          <p>
            <b>{i.cards.length}</b> Cards
          </p>
        </Link>
      ))}
    </>
  );
}
