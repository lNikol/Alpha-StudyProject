import React, { useState } from "react";
import userApi from "../../http";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ user, setIsAuth }) => {
  const navigate = useNavigate();

  const [user_, setUser_] = useState(user || "");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      if (e.target.className === "UserName") {
        userApi
          .put("/changeName", { newName: user_ })
          .then(() => {
            userApi
              .get("/refresh", {})
              .then((res) => {
                localStorage.setItem("token", res.data.accessToken);
                if (res.data.user.username) setUser_(res.data.user.username);
                alert("Name was changed");
              })
              .catch((e) => alert(e?.response?.data?.message));
          })
          .catch((e) => {
            alert(e?.response?.data?.message);
            setUser_(user);
          });
      } else if (e.target.id === "newPassword") {
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
      .then(() => {
        setIsAuth(false);
        localStorage.token = "";
        navigate("/");
      })
      .catch((e) => console.log(e.response.data.message));
  };

  return (
    <div className="m-2">
      <h2>Welcome, {user}</h2>
      <button
        className="btn btn-warning btn-sm"
        onClick={async () => {
          setIsAuth(false);
          await AuthService.logout();
          localStorage.setItem("token", "");
          navigate("/");
        }}>
        Log out
      </button>
      <div>
        <label htmlFor="username" className="m-3">
          Name
        </label>
        <input
          type="text"
          id="username"
          value={user_ || ""}
          className="UserName"
          onChange={(e) => setUser_(e.target.value)}
          onKeyDown={handleEnterPress}
        />
      </div>
      <div>
        <button
          className="btn btn-warning btn-sm"
          onClick={() => setShowChangePassword(!showChangePassword)}>
          Change password
        </button>
        <button
          className="btn btn-warning btn-sm m-1"
          onClick={handleDeleteAccountClick}>
          Delete Account
        </button>
      </div>
      {showChangePassword && (
        <div>
          <label htmlFor="oldPassword">Old password</label>
          <input
            type="text"
            id="oldPassword"
            value={oldPassword}
            className="m-2"
            onChange={(e) => setOldPassword(e.target.value)}
            onKeyDown={handleEnterPress}
          />
          <label htmlFor="newPassword">New password</label>
          <input
            type="text"
            id="newPassword"
            className="newPassword m-2"
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
