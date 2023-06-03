import { useEffect, useState } from "react";
import Card from "../Card/Card";
import Writing from "../Writing/Writing";
import QuizComponent from "../Quiz/QuizComponent";
import userApi from "../../http";
import { useParams } from "react-router-dom";
import "./StudySet.css";
export default function StudySet({ studySets, user }) {
  const { namee } = useParams();
  const [set, setSet] = useState([]);

  const [cardname, setCardName] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [tags, setTags] = useState("");
  const [quiz, setQuiz] = useState(false);
  const [writing, setWriting] = useState(false);
  const [writingShow, setWritingShow] = useState(false);
  const [languages, setLanguages] = useState(false);

  let allTags = [];

  useEffect(() => {
    studySets.forEach((e) => {
      if (e.name === namee) {
        setSet(e);
        if (set.cards) {
          set.cards.map((i) => {
            i.tags.map((d) => {
              if (!allTags.includes(d)) allTags.push(d);
            });
          });
        }
      }
    });
  }, []);

  const startQuiz = () => {
    setQuiz(!quiz);
  };

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
        setSet(res.data.set);
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
                (info != ""
                  ? "\nHere are the cards that already exist:\n" + info
                  : "")
            );
          }
        } else {
          alert(err);
        }
      });
  };

  const createCard = () => {
    if (cardname == "" || descriptions == "" || tags == "")
      alert("Fields cannot be empty");
    else {
      userApi
        .post("/createCard", {
          cardname: cardname,
          descriptions: descriptions,
          tags: tags,
          studySet: namee,
        })
        .then((res) => {
          setCardName("");
          setDescriptions("");
          setTags("");
          setSet(res.data.set);
          alert(res.data.message);
        })
        .catch((e) => {
          let msg = "";
          msg += e?.response?.data?.message;
          msg += "\n" + e.response.data.errors[0].msg;
          alert(msg);
        });
    }
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
  if (writing) return <Writing cards={set.cards} languages={languages} />;
  if (quiz) return <QuizComponent tags={allTags} cards={set.cards} />;

  return (
    <div
      key={set.name + "moon"}
      style={{
        "--bs-gutter-x": "0.1",
        marginLeft: "5px",
        "--bs-gutter-y": "0",
        display: "flex",
        flexWrap: "wrap",
        marginTop: "calc(-1 * var(--bs-gutter-y))",
        marginRight: "calc(-.5 * var(--bs-gutter-x))",
        marginLeft: "10px",
      }}
      className="row">
      {set.name != "" ? (
        <>
          <b>{set.name}</b>
          <i>
            {" "}
            <input
              type="file"
              name="userFile"
              onChange={(e) => {
                sendingFile(e, set.name);
              }}
            />
          </i>
        </>
      ) : (
        ""
      )}
      <div className="col-sm-3">
        <div>
          <h4>Cardname</h4>
          <input
            type="text"
            value={cardname}
            onChange={(e) => setCardName(e.target.value)}></input>
        </div>
        <div>
          <h4>Descriptions</h4>
          <input
            type="text"
            value={descriptions}
            onChange={(e) => setDescriptions(e.target.value)}></input>
        </div>
        <div>
          <h4>Tags</h4>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}></input>
        </div>
        <button onClick={createCard}>Create card</button>

        {set.cards != undefined && set.cards.length >= 1 ? (
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
      </div>

      <div
        className="col-sm-8 d-grid"
        id="lis"
        style={{
          gridTemplateColumns: "repeat(auto-fill,minmax(276px,1fr))",
          padding: "1.6rem 0",
          gap: "1.6rem",
          overflowY: "scroll",
        }}>
        {set.cards != undefined ? (
          <>
            {set.cards.map((i, index) => (
              <div className="content-container" key={index + "-=-"}>
                <Card key={i + index} {...i} studyset={namee} />
              </div>
            ))}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
