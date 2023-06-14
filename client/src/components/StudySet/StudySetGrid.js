import { Link } from "react-router-dom";
import { useState } from "react";
import userApi from "../../http";

export default function StudySetGrid({ studySets, setStudySets }) {
  const [studySet, setStudySet] = useState(false);
  const [studyValue, setStudyValue] = useState("");

  const sendSet = () => {
    userApi
      .post("/studyset/createSet", { studysetName: studyValue.trim() })
      .then((res) => setStudySets(res.data))
      .catch((e) => {
        console.log(e);
        alert(e?.response?.data?.message);
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
            onChange={(e) => setStudyValue(e.target.value)}
            style={{ marginTop: "5px" }}></input>
          <button
            className="rounded"
            style={{
              background: "#ffc720",
              border: "0",
              padding: "3px 8px 3px 8px",
              marginLeft: "3px",
            }}
            onClick={sendSet}>
            Create
          </button>
        </div>
      ) : (
        ""
      )}

      {studySets.map((i, index) => (
        <Link
          className="nav-link p-3 m-3 text-center rounded"
          style={{
            maxWidth: `40%`,
            border: "1px solid rgb(148, 108, 238)",
          }}
          key={index + "link"}
          to={`/library/studysets/${i.name}`}>
          <h4>{i.name}</h4>
          <b>{i.cards.length}</b> Cards
          <h6></h6>
          <b>{i.files.length}</b> Files
        </Link>
      ))}
    </>
  );
}
