import axios from "axios";
import { useState } from "react";

const User = () => {
  const [userInfo, setUserInfo] = useState("");

  const getReq = axios.create({
    baseURL: "http://localhost:5000/user", // /auth  /user
    headers: {
      username: "admin2",
      password: "admin2",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NmJiMDMwZGRiZWRhNjgwYzQwMTNhMyIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTY4NDc3OTM3MiwiZXhwIjoxNjg0NzgyOTcyfQ.dS_Aez8OeSm1OJGwBminzlxuv1Mp61xeW6wdaXpFu60",
      cardname: "name",
      descriptions: "fas",
      tags: ["ra", "afs"],
    },
  });

  const sendingFile = (e) => {
    let file = e.target.files[0];
    uploadFile(file);
    e.target.value = "";
    // getReq.post("/sendUserFile", {}).then();
  };
  const uploadFile = (file) => {
    let formData = new FormData();
    formData.append("userFile", file);
    getReq
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
          if (err.response.data.message) alert(err.response.data.message);
        } else {
          alert(err);
        }
      });
  };
  return (
    <>
      <input type="file" name="userFile" onChange={sendingFile} />

      <form
        action="http://localhost:5000/user/sendExample"
        method="post"
        enctype="multipart/form-data">
        <input type="submit" value="Get example" />
      </form>
    </>
  );
};
export default User;
