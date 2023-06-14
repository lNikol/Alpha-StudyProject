import { useEffect, useState } from "react";
import Card from "../Card/Card";
import Writing from "../Writing/Writing";
import QuizComponent from "../Quiz/QuizComponent";
import userApi from "../../http";
import { useParams, useNavigate } from "react-router-dom";
import "./StudySet.css";

export default function StudySet({ studySets, user }) {
  const navigate = useNavigate();

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
    uploadFile(e.target.files[0], setName);
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
        setSet(err.response.data.set);
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
      .then((res) => setSet(res.data))
      .catch((err) => {
        alert(err?.response?.data?.message);
      });
  };

  const deleteThisFile = (setName, file) => {
    userApi
      .delete("/files/deleteFile", {
        data: { set: setName, fileName: file.name, fileId: file.id },
      })
      .then((res) => (res.data != "" ? setSet(res.data) : ""))
      .catch((e) => console.log(e));
  };

  const deleteSet = () => {
    userApi
      .delete("/studyset/deleteSet", {
        data: { setName: set.name },
      })
      .catch((e) => console.log(e));
    navigate("/library");
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
          className="nav-link rounded-pill"
          style={{
            cursor: "pointer",
            marginLeft: "10px",
            paddingLeft: "10px",
            background: "lightgray",
            paddingRight: "10px",
            marginTop: "5px",
          }}
          onClick={() => setActiveTab("Cards")}>
          Cards
        </a>
        <a
          className="nav-link rounded-pill"
          style={{
            cursor: "pointer",
            marginLeft: "10px",
            background: "lightgray",
            paddingLeft: "10px",
            paddingRight: "10px",
            marginTop: "5px",
          }}
          onClick={() => setActiveTab("Files")}>
          Files
        </a>
      </div>
    );
  };

  const checkColor = () => {
    currentColor === 1 ? (currentColor = 0) : currentColor++;
  };
  const colors = ["#FDAD1C", "#C8A2C8"];
  let currentColor = 0;
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
                    <Card
                      setSet={setSet}
                      key={i + index}
                      {...i}
                      studyset={namee}
                    />
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
            <div className="m-1">
              <i>Upload file: </i>
              <input
                type="file"
                name="userFile"
                accept=".docx,.doc,.pdf,.txt"
                onChange={(e) => {
                  uploadSetFile(e.target.files[0], set.name);
                }}
                style={{ marginTop: "30px" }}
              />
            </div>
            {set?.files?.length >= 1 ? (
              <div style={{ display: "grid" }}>
                {set.files.map((i) => (
                  <div
                    key={i.name + "file"}
                    className="d-inline text-center rounded m-1"
                    style={{
                      maxWidth: "40%",
                      background: colors[currentColor],
                    }}
                    onLoad={checkColor()}>
                    <a
                      key={i.name}
                      style={{
                        cursor: "pointer",
                        margin: "20px",
                        maxWidth: "80%",
                      }}
                      onClick={() => {
                        getFile(set.name, i.name);
                      }}>
                      {i.name}
                    </a>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm rounded m-2"
                      style={{ float: "right" }}
                      onClick={() => {
                        deleteThisFile(set.name, i);
                      }}></button>
                  </div>
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
      <div className="m-2">
        <form>
          <label htmlFor="languages">
            Two languages?
            <input
              id="languages"
              type="checkbox"
              style={{ marginLeft: "5px" }}
            />
          </label>
        </form>
        <button
          className="rounded btn btn-warning"
          style={{
            border: "0",
            padding: "3px 8px 3px 8px",
            marginLeft: "3px",
          }}
          onClick={() => {
            setLanguages(document.getElementById("languages").checked);
            setWritingShow(!writingShow);
            setWriting(!writing);
          }}>
          Start
        </button>
      </div>
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
        marginTop: "10px",
        marginRight: "calc(-.5 * var(--bs-gutter-x))",
        marginLeft: "10px",
      }}
      className="row">
      {set.name != "" ? (
        <>
          <div style={{ display: "flex" }}>
            <i>
              Send Excel file:{" "}
              <input
                style={{
                  fontFamily: "unset",
                  lineHeight: "unset",
                  fontSize: "unset",
                }}
                type="file"
                name="userFile"
                accept=".xlsx"
                onChange={(e) => {
                  sendingFile(e, set.name);
                }}
              />
            </i>
            <Menu setActiveTab={setActiveTab}></Menu>
          </div>
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
        <button
          className="btn btn-warning btn-sm rounded-pill"
          style={{
            padding: "4px 10px 4px 10px",
            marginTop: "5px",
            marginBottom: "5px",
          }}
          onClick={createCard}>
          Create card
        </button>

        {set.cards != undefined && set.cards.length >= 1 ? (
          <>
            <button
              style={{ margin: "15px", padding: "4px 15px 4px 15px" }}
              className="btn btn-warning btn-sm rounded-pill"
              onClick={() => {
                setWritingShow(false);
                startQuiz();
              }}>
              Quiz
            </button>
            <button
              style={{
                margin: "15px",
                marginLeft: "0",
                padding: "4px 15px 4px 15px",
              }}
              className="btn btn-warning btn-sm rounded-pill"
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
        <div style={{ height: "1px" }}></div>
        <button
          onClick={deleteSet}
          className="btn btn-warning btn-sm rounded-pill"
          style={{ padding: "4px 13px 4px 13px" }}>
          Delete set
        </button>
      </div>
      <div className="col-sm-8">
        <h2
          className="rounded "
          style={{
            border: "1px solid #f0f0f0",
            maxWidth: "25%",
            textAlign: "center",
            marginLeft: "440px",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}>
          {set.name}
        </h2>
        <Content activeTab={activeTab} />
      </div>
    </div>
  );
}
