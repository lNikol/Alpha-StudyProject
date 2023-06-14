import React, { useState } from "react";
import AuthService from "../../services/AuthService";

const LoginForm = ({ isAuth, setUser }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ margin: "5px" }}>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUserName(e.target.value)}
        value={username}
        style={{
          background: "#EFA31C",
          border: "1px solid black",
        }}
        className="rounded m-1"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        style={{
          background: "#EFA31C",
          border: "1px solid black",
        }}
        className="rounded m-1"
      />

      <button
        className="btn-sm rounded text-white"
        onClick={() => {
          AuthService.login(username, password)
            .then((res) => {
              localStorage.setItem("token", res.data?.accessToken);
              setUser(res.data.user);
              isAuth(true);
            })
            .catch((e) => alert(e.response?.data?.message));
        }}
        style={{
          marginLeft: "5px",
          background: "#808080",
          border: "1px solid black",
        }}>
        Login
      </button>

      <button
        className="btn-sm rounded text-white"
        onClick={() => {
          AuthService.registration(username, password)
            .then((res) => {
              localStorage.setItem("token", res.data?.accessToken);
              setUser(res.data.user);
              isAuth(true);
            })
            .catch((e) => {
              let msgForAlert = "";
              if (e.response?.data?.errors.length >= 1) {
                e.response.data.errors.forEach(
                  (i) => (msgForAlert += i.msg + "\n")
                );
                alert(msgForAlert);
              } else {
                alert(e.response?.data?.message);
              }
            });
        }}
        style={{
          marginLeft: "5px",
          background: "#808080",
          border: "1px solid black",
        }}>
        Registration
      </button>
    </div>
  );
};
export default LoginForm;
