import { Link } from "react-router-dom";
import "./Menu.css";
export default function Menu() {
  return (
    <nav style={{ textAlign: "center" }}>
      <Link className="Link" to="/">
        Home page
      </Link>
      <Link className="Link" to="/library">
        Library
      </Link>
      <Link className="Link" to="/profile">
        Profile
      </Link>
      <Link className="Link" to="/community">
        Community
      </Link>
    </nav>
  );
}
