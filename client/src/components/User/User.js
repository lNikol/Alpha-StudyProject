import axios from "axios";
import { useState } from "react";
const User = () => {
  const [userInfo, setUserInfo] = useState("");

  const getReq = axios.create({ baseURL: "http://localhost:5000/auth" });

  const handler = () => {
    getReq
      .post("createCard", {
        username: "admin2",
        password: "admin2",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjBmZWU0Y2UyZThkOWVhZmZmZTNkNyIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTY4NDA3ODc1NSwiZXhwIjoxNjg0MDgyMzU1fQ.PlxCUDq87fbQRtstWEShxTM6QpgMrvc9JnKMIPUg8II",
        cardname: "name",
        descriptions: "fas",
        tags: ["ra", "afs"],
      })
      .then((res) => {
        console.log(res.data);
        setUserInfo(res.data);
        console.log(userInfo);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <button onClick={handler}>Check</button>
    </>
  );
};
export default User;
