import { useEffect, useState } from "react";
import userApi from "../../http";
import StudySetGrid from "../StudySet/StudySetGrid";

export default function Library({ studySets_, setstudySets_, user }) {
  const [studySets, setStudySets] = useState(studySets_);
  useEffect(() => {
    userApi
      .get("/studyset/studysets")
      .then((res) => {
        if (res) {
          setstudySets_(res.data);
          setStudySets(res.data);
        }
      })
      .catch((e) => console.log(e));
  }, [() => {}]);

  const getExample = () => {
    userApi
      .post("/sendExample", "", { responseType: "blob" })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "template.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="container-fluid">
      <div
        style={{
          display: "flex",
        }}>
        <div className="col-sm-4">
          <h3>Create Your Own Set</h3>
          <button className="btn btn-warning" onClick={getExample}>
            Get Example
          </button>
          <h2>Your sets </h2>
          <StudySetGrid
            studySets={studySets}
            setStudySets={setStudySets}
            user={user}
          />
        </div>
        <div className="col-sm-8">
          {/* <h1>StudySet</h1>
          <nav
            className="navbar navbar-expand-lg navbar-light bg-light"
            style={{ textAlign: "center" }}>
            <ul className="navbar-nav">
              <li className="nav-item nav-link">Flashcards</li>
              <li className="nav-item nav-link">Files</li>
              <li className="nav-item nav-link">Notes</li>
            </ul>
          </nav> */}
        </div>
      </div>
    </div>
  );
}
