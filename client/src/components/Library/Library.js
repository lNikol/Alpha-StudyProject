import { useEffect, useState } from "react";
import userApi from "../../http";
import StudySet from "../StudySet/StudySet";

export default function Library(user) {
  let [studySets, setStudySets] = useState([]);
  useEffect(() => {
    userApi
      .get("/studyset/studysets")
      .then((res) => {
        if (res) setStudySets(res.data);
      })
      .catch((e) => console.log(e));
  });

  const sendingFile = (e) => {
    let file = e.target.files[0];
    uploadFile(file);
    e.target.value = "";
  };

  const uploadFile = (file) => {
    let formData = new FormData();

    formData.append("user", JSON.stringify(user));
    formData.append("userFile", file);
    formData.append("studySet", "test");
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
    <>
      <button onClick={getExample}>Get example</button>
      {/* <div>Create Set</div> */}
      {/* <input type="file" name="userFile" onChange={sendingFile} /> */}

      <h2>Your sets </h2>

      {studySets.map((i, index) => (
        <StudySet key={i.name + index} {...i} />
      ))}
    </>
  );
}
