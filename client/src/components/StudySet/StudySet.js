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
  const [activeTab, setActiveTab] = useState("Cards");
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

  const sendingFile = (e, setName) => {
    let file = e.target.files[0];
    uploadFile(file, setName);
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

  const getFile = (setName, fileName) => {
    userApi
      .post(
        "/studyset/sendFile",
        {
          studysetName: setName,
          fileName: fileName,
        },
        { responseType: "blob" }
      )

      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((e) => console.log(e));
  };

  const uploadSetFile = (file, setName) => {
    let formData = new FormData();
    formData.append("user", JSON.stringify(user));
    formData.append("fileName", file.name);
    formData.append("userFile", file);
    formData.append("studysetName", setName);
    userApi
      .post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data; charset=UTF-8",
        },
      })
      .then((res) => {
        console.log(res.data);
        setSet(res.data);
      })
      .catch((err) => {
        alert(err?.response?.data?.message);
      });
  };

  const Menu = () => {
    return (
      <div
        style={{
          marginLeft: "20px",
          display: "inline-flex",
          marginLeft: "2.5%",
        }}>
        <a
          className="nav-link"
          style={{ cursor: "pointer", marginLeft: "10px" }}
          onClick={() => setActiveTab("Cards")}>
          Cards
        </a>
        <a
          className="nav-link"
          style={{ cursor: "pointer", marginLeft: "50%" }}
          onClick={() => setActiveTab("Files")}>
          Files
        </a>
      </div>
    );
  };

  const Content = ({ activeTab }) => {
    switch (activeTab) {
      case "Cards":
        return (
          <div
            className="d-grid"
            id="lis"
            style={{
              gridTemplateColumns: "repeat(auto-fill,minmax(276px,1fr))",
              padding: "1.6rem 0",
              gap: "1.6rem",
              overflow: "auto",
              maxHeight: "600px",
            }}>
            {set.cards != undefined
              ? set.cards.map((i, index) => (
                  <div className="content-container" key={index + "-=-"}>
                    <Card key={i + index} {...i} studyset={namee} />
                  </div>
                ))
              : ""}
          </div>
        );
      case "Files":
        return (
          <div
            id="lis"
            style={{
              overflow: "auto",
              maxHeight: "600px",
            }}>
            <i>Upload file: </i>
            <input
              type="file"
              name="userFile"
              onChange={(e) => {
                uploadSetFile(e.target.files[0], set.name);
              }}
              style={{ marginTop: "30px" }}
            />

            {set?.files?.length >= 1 ? (
              <div style={{ display: "grid" }}>
                {set.files.map((i) => (
                  <a
                    key={i.name}
                    style={{
                      cursor: "pointer",
                      margin: "20px",
                      maxWidth: "40%",
                    }}
                    onClick={() => {
                      getFile(set.name, i.name);
                    }}>
                    {i.name}
                  </a>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
        );
      default:
        return null;
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
        <div style={{ display: "flex" }}>
          <b>{set.name}</b>
          <i style={{ marginLeft: "20px" }}>
            Send Excel file:{" "}
            <input
              type="file"
              name="userFile"
              onChange={(e) => {
                sendingFile(e, set.name);
              }}
            />
          </i>
          <Menu setActiveTab={setActiveTab}></Menu>
        </div>
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
        <button className="btn btn-warning btn-sm" onClick={createCard}>
          Create card
        </button>

        {set.cards != undefined && set.cards.length >= 1 ? (
          <>
            <button
              style={{ margin: "15px" }}
              className="btn btn-warning btn-sm"
              onClick={() => {
                setWritingShow(false);
                startQuiz();
              }}>
              Quiz
            </button>
            <button
              style={{ margin: "15px", marginLeft: "0" }}
              className="btn btn-warning btn-sm"
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
      <div className="col-sm-8">
        <Content activeTab={activeTab} />
      </div>
    </div>
  );
}
