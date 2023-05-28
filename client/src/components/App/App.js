import "./App.css";
import LoginForm from "../LoginForm/LoginForm";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import userApi from "../../http";
import Writing from "../Writing/Writing";
import Menu from "../Menu/Menu";
import HomePage from "../HomePage/HomePage";
import UserProfile from "../UserProfile/UserProfile";
import Community from "../Community/Community";
import Library from "../Library/Library";

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
      <Router>
        <Menu />
        <Routes>
          <Route
            exact
            path="/"
            element={<HomePage username={user.username} />}></Route>
          <Route
            exact
            path="/library"
            element={<Library user={user} />}></Route>
          <Route
            exact
            path="/profile"
            element={<UserProfile user={user} setIsAuth={setIsAuth} />}></Route>
          <Route exact path="/community" element={<Community />}></Route>
        </Routes>
      </Router>

      {/* <Writing username={user.username} /> */}
    </div>
  );
}

export default App;
