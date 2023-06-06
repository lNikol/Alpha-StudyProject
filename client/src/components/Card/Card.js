import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import userApi from "../../http/index";
export default function Card({
  name,
  descriptions,
  tags,
  favorite,
  knowledge,
  studyset,
}) {
  let [isBgRed, setIsBgRed] = useState(favorite);

  const replaceFavorite = () => {
    isBgRed = !isBgRed;
    setIsBgRed(isBgRed);

    userApi.put("/card/replaceFavorite", {
      studyset: studyset,
      cardname: name,
      favorite: isBgRed,
    });
  };

  return (
    <div
      className="card"
      key={name + "sun"}
      style={{ backgroundColor: "rgb(201, 200, 203)" }}>
      <div className="card-body">
        <div className="min-w-0">
          {tags.map((t) => (
            <span
              key={t + "bob"}
              style={{ backgroundColor: "#f9bd09", color: "green" }}
              className="d-inline-block px-2 py-1 rounded m-1">
              {t}
            </span>
          ))}

          <div className="dropdown pull-right d-inline-block">
            <button
              className="btn btn-default dropdown-toggle"
              type="button"
              data-toggle="dropdown">
              <span className="glyphicon glyphicon-option-vertical"></span>
            </button>
            <ul className="dropdown-menu">
              <li>
                <a href="#">Edit</a>
              </li>
              <li>
                <a href="#">Move</a>
              </li>
              <li>
                <a href="#">Add tags</a>
              </li>
              <li>
                <a href="#">Delete</a>
              </li>
            </ul>
          </div>
          <div
            className="d-inline-block text-white rounded"
            style={{
              backgroundColor: isBgRed === true ? "green" : "red",
            }}
            onClick={replaceFavorite}>
            <span>&#10084;</span>
          </div>
        </div>

        <div className="m-1">
          <span
            key={name + "ja"}
            className="bg-danger text-white px-2 py-1 rounded">
            {name}
          </span>
        </div>
        <div className="d-inline-block">
          {descriptions.map((d) => (
            <span
              key={d + "jak"}
              className="d-inline-block bg-success text-white px-2 py-1 rounded m-1">
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
