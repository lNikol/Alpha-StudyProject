import { useEffect, useState } from "react";
import Card from "../Card/Card";
import Writing from "../Writing/Writing";
import QuizComponent from "../Quiz/QuizComponent";
import userApi from "../../http";

export default function StudySet({ name, cards, num, user }) {
  const [quiz, setQuiz] = useState(false);
  const [writing, setWriting] = useState(false);
  const [writingShow, setWritingShow] = useState(false);
  const [languages, setLanguages] = useState(false);
  const [studyValue, setStudyValue] = useState("");
  const [studySet, setStudySet] = useState(false);
  let allTags = [];

  useEffect(() => {
    cards.map((i) => {
      i.tags.map((d) => {
        if (!allTags.includes(d)) allTags.push(d);
      });
    });
  }, []);

  const sendSet = () => {
    userApi
      .post("/studyset/createSet", { studysetName: studyValue })
      .catch((err) => {
        alert(err.response.data.message);
      });
    setStudyValue("");
  };

  const startQuiz = () => {
    setQuiz(!quiz);
  };

  if (writingShow) {
    return (
      <>
        <form>
          <label htmlFor="languages">Two languages?</label>
          <input id="languages" type="checkbox" />
        </form>
        <button
          onClick={() => {
            setLanguages(document.getElementById("languages").checked);
            setWritingShow(!writingShow);
            setWriting(!writing);
          }}>
          Start
        </button>
      </>
    );
  }
  if (writing) return <Writing cards={cards} languages={languages} />;
  if (quiz) return <QuizComponent tags={allTags} cards={cards} />;

  const sendingFile = (e, name) => {
    let file = e.target.files[0];
    uploadFile(file, name);
    e.target.value = "";
  };

  const uploadFile = (file, name) => {
    let formData = new FormData();
    formData.append("user", JSON.stringify(user));
    formData.append("userFile", file);
    formData.append("studySet", name);
    userApi
      .post("createCard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        if (err.response) {
          let existsCards = err.response.data.existsCards;
          let info = "";
          if (existsCards?.length >= 1) {
            existsCards.map((i) => {
              info += i.toString() + "\n";
            });
          }
          if (err.response.data.message) {
            alert(
              err.response.data.message +
                "\nHere are the cards that already exist:\n" +
                info
            );
          }
        } else {
          alert(err);
        }
      });
  };

  return (
    <div style={{ marginLeft: "5px" }}>
      {num == 0 ? (
        <div>
          <button onClick={() => setStudySet(!studySet)}>Create set</button>
        </div>
      ) : (
        ""
      )}
      {studySet == true ? (
        <>
          <div>
            <input
              type="text"
              value={studyValue}
              onChange={(e) => setStudyValue(e.target.value)}></input>
            <button onClick={sendSet}>Create</button>
          </div>
        </>
      ) : (
        ""
      )}
      {name != "" ? (
        <>
          <b>{name}</b>
          <i>
            {" "}
            <input
              type="file"
              name="userFile"
              onChange={(e) => {
                sendingFile(e, name);
              }}
            />
          </i>
        </>
      ) : (
        ""
      )}

      {cards.map((i, index) => (
        <div
          key={index + "_"}
          style={{
            margin: "10px",
            border: "1px solid blue",
            width: "200px",
            // display: "grid",
            // gridTemplateColumns: "200px 200px 200px",
          }}>
          <Card key={i + index} {...i} />
        </div>
      ))}
      {cards.length >= 1 ? (
        <>
          <button
            style={{ margin: "15px" }}
            onClick={() => {
              setWritingShow(false);
              startQuiz();
            }}>
            Quiz
          </button>
          <button
            style={{ margin: "15px" }}
            onClick={() => {
              setWritingShow(!writingShow);
              setQuiz(false);
            }}>
            Writing
          </button>
        </>
      ) : (
        ""
      )}

      {writingShow == true ? "" : ""}
    </div>
  );
}
