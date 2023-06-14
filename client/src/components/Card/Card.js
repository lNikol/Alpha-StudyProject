import "@popperjs/core";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import userApi from "../../http/index";
import "./Card.css";
export default function Card({
  name,
  descriptions,
  tags,
  favorite,
  knowledge,
  studyset,
  _id,
  setSet,
}) {
  // let [isBgRed, setIsBgRed] = useState(favorite);
  // const replaceFavorite = () => {
  //   isBgRed = !isBgRed;
  //   setIsBgRed(isBgRed);
  //   userApi.put("/card/replaceFavorite", {
  //     studyset: studyset,
  //     cardname: name,
  //     favorite: isBgRed,
  //   });
  // };

  const deleteThisCard = () => {
    userApi
      .delete("/card/deleteCardById", { data: { set: studyset, cardId: _id } })
      .then((res) => setSet(res.data))
      .catch((e) => console.log(e));
  };

  return (
    <div
      className="card"
      key={name + "sun"}
      style={{ backgroundColor: "#F0F0F0" }}>
      <div className="card-body">
        <div className="min-w-0">
          {tags.map((t) => (
            <span
              key={t + "bob"}
              style={{ backgroundColor: "#F1B449", color: "white" }}
              className="d-inline-block px-2 py-1 rounded m-1">
              {t}
            </span>
          ))}

          {/* <div
            className="d-inline-block text-white rounded"
            onClick={replaceFavorite}>
            {isBgRed === true ? (
              <span id="sp">&#9989;</span>
            ) : (
              <span id="sp">&#10084;</span>
            )}
          </div> */}

          <button
            type="button"
            className="btn btn-sm"
            style={{ float: "right", background: "#946CEE" }}
            onClick={deleteThisCard}></button>

          {/* <div className="dropdown d-inline">
            <a
              className="btn dropdown-toggle"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"></a>

            <div
              className={"popup" + name}
              style={{
                display: "none",
                position: "absolute",
                width: "200px",
                height: "100px",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
              }}>
              <input
                type="text"
                className="popup-input"
                style={{
                  display: "block",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              />
              <p className="popup-text">Текст</p>
            </div>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <a className="dropdown-item">Edit</a>
              </li>
              <li>
                <a className="dropdown-item">Move</a>
              </li>
              <li>
                <a className="dropdown-item">Add tags</a>
              </li>
              <li>
                <a className="dropdown-item">Delete</a>
              </li>
            </ul>
          </div> */}
        </div>
        <div className="m-1">
          <span
            key={name + "ja"}
            className="text-white px-2 py-1 rounded"
            style={{ background: "#946CEE" }}>
            {name}
          </span>
        </div>

        <div className="d-inline-block">
          {descriptions.map((d) => (
            <span
              key={d + "jak"}
              className="d-inline-block text-white px-2 py-1 rounded m-1"
              style={{ background: "#50C879" }}>
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
