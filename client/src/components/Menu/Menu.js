import { Link } from "react-router-dom";
import "./Menu.css";

export default function Menu() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{ textAlign: "center" }}>
      <ul className="navbar-nav justify-content-center align-items-center">
        <Link className="navbar-brand" to="/">
          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "66px",
              height: "66px",
              marginRight: "135px",
              marginLeft: "20px",
              background: "#F1B449",
            }}>
            <h3
              className="ml-3 mb-0"
              style={{
                marginLeft: "90px",
                fontFamily: "Ink Free",
                fontWeight: "bold",
              }}>
              StudyProject
            </h3>
          </div>
        </Link>
        <li className="nav-item">
          <Link
            style={{
              background: "#F1B449",
              paddingLeft: "10px",
              paddingRight: "10px",
              fontWeight: "bold",
            }}
            className="m-2 nav-link rounded-pill"
            to="/">
            Home page
          </Link>
        </li>
        <li className="nav-item">
          <Link
            style={{
              background: "#F1B449",
              paddingLeft: "20px",
              paddingRight: "20px",
              fontWeight: "bold",
            }}
            className="m-2 nav-link rounded-pill"
            to="/library">
            Library
          </Link>
        </li>
        <li className="nav-item">
          <Link
            style={{
              background: "#F1B449",
              paddingLeft: "20px",
              paddingRight: "20px",
              fontWeight: "bold",
            }}
            className="m-2 nav-link rounded-pill"
            to="/profile">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link
            style={{
              background: "#F1B449",
              paddingLeft: "10px",
              paddingRight: "10px",
              fontWeight: "bold",
            }}
            className="m-2 nav-link rounded-pill"
            to="/community">
            Community
          </Link>
        </li>
      </ul>
    </nav>
  );
}
