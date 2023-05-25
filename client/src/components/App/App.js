import "./App.css";
import LoginForm from "../LoginForm/LoginForm";
import { useEffect, useState } from "react";
import AuthService from "../../services/AuthService";
import userApi from "../../http";
import User from "../User/User";

async function checkAuth(isAuth, user) {
  try {
    const response = await userApi.get(`/refresh`, {
      withCredentials: true,
    });
    localStorage.setItem("token", response.data.accessToken);
    user(response.data.user);
    isAuth(true);
  } catch (e) {
    // console.log(e);
    console.log(e.response?.data?.message);
  }
}

function App() {
  let [user, setUser] = useState("");
  let [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      checkAuth(setIsAuth, setUser);
    }
  }, []);
  if (!isAuth) return <LoginForm isAuth={setIsAuth} setUser={setUser} />;

  return (
    <div className="App">
      <h2>{isAuth ? "Вы авторизованы" : "Авторизуйтесь"}</h2>
      <button
        onClick={async () => {
          await AuthService.logout();
          setIsAuth(false);
          localStorage.setItem("token", "");
        }}>
        Log out
      </button>
      <User {...user} />
    </div>
  );
}

export default App;
