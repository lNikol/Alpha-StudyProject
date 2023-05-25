import React, { useState } from "react";
import AuthService from "../../services/AuthService";

const LoginForm = ({ isAuth, setUser }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUserName(e.target.value)}
        value={username}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button
        onClick={() => {
          AuthService.login(username, password)
            .then((res) => {
              localStorage.setItem("token", res.data?.accessToken);
              setUser(res.data.user);
              isAuth(true);
            })
            .catch((e) => alert(e.response?.data?.message));
        }}>
        Login
      </button>

      <button
        onClick={() => {
          AuthService.registration(username, password)
            .then((res) => {
              localStorage.setItem("token", res.data?.accessToken);
              setUser(res.data.user);
              isAuth(true);
            })
            .catch((e) => {
              let msgForAlert = "";
              console.log(e);
              if (e.response?.data?.errors.length >= 1) {
                e.response.data.errors.forEach(
                  (i) => (msgForAlert += i.msg + "\n")
                );
                alert(msgForAlert);
              } else {
                alert(e.response?.data?.message);
              }
            });
        }}>
        Registration
      </button>
    </div>
  );
};
export default LoginForm;
