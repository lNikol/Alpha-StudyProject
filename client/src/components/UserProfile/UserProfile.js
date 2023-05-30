import React, { useState } from "react";
import userApi from "../../http";
import AuthService from "../../services/AuthService";
import "./UserProfile.css";

const UserProfile = ({ user, setIsAuth }) => {
  let [user_, setUser_] = useState({
    username: user.username || "",
    password: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      if (e.target.className === "UserName") {
        userApi
          .put("/changeName", { newName: user_.username })
          .then((res) => alert(res.data.message));
        userApi
          .get("/refresh", {})
          .then((res) => {
            localStorage.setItem("token", res.data.accessToken);
            if (res.data.user.username) setUser_(res.data.user.username);
          })
          .catch((e) => alert(e?.response?.data?.message));
      } else if (e.target.className === "newPassword") {
        userApi
          .put("/changePassword", {
            oldPassword,
            newPassword,
          })
          .then((res) => {
            alert(res?.data?.message);
            setShowChangePassword(false);
            setNewPassword("");
            setOldPassword("");
          })
          .catch((e) => alert(e?.response?.data?.message));
      }
    }
  };

  const handleDeleteAccountClick = () => {
    userApi
      .delete("/deleteAccount")
      .catch((e) => console.log(e.response.data.message));
    document.location = "/";
  };

  return (
    <div>
      <h2>Welcome, {user.username}</h2>

      <button
        onClick={async () => {
          await AuthService.logout();
          setIsAuth(false);
          localStorage.setItem("token", "");
          document.location = "/";
        }}>
        Log out
      </button>
      <div className="userInfo">
        <label htmlFor="username">Name</label>
        <input
          type="text"
          id="username"
          value={user_.username || ""}
          className="UserName"
          onChange={(e) => setUser_({ ...user_, username: e.target.value })}
          onKeyDown={handleEnterPress}
        />
      </div>
      <div>
        <button onClick={() => setShowChangePassword(!showChangePassword)}>
          Change password
        </button>
        <button onClick={handleDeleteAccountClick}>Delete Account</button>
      </div>
      {showChangePassword && (
        <div>
          <label htmlFor="oldPassword">Old password</label>
          <input
            type="text"
            id="oldPassword"
            value={oldPassword}
            className="UserPassword"
            onChange={(e) => setOldPassword(e.target.value)}
            onKeyDown={handleEnterPress}
          />
          <label htmlFor="newPassword">New password</label>
          <input
            type="text"
            id="newPassword"
            className="newPassword"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={handleEnterPress}
          />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
