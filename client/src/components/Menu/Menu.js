import { Link } from "react-router-dom";
import "./Menu.css";

export default function Menu() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{ textAlign: "center" }}>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/">
            Home page
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/library">
            Library
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/community">
            Community
          </Link>
        </li>
      </ul>
    </nav>
  );
}
