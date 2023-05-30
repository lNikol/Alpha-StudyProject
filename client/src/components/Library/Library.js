import { useEffect, useState } from "react";
import userApi from "../../http";
import StudySetGrid from "../StudySet/StudySetGrid";

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
      <h2>Your sets </h2>

      <StudySetGrid studySets={studySets} user={user} />
    </>
  );
}
