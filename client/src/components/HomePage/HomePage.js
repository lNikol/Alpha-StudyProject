import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HomePage({ username }) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    let day = new Date().getDay();
    if (day === 0) day = daysOfWeek.length - 1;
    setCurrentDay(daysOfWeek[day - 1]);
  }, []);

  return (
    <div
      className="main-block"
      style={{
        backgroundColor: "rgb(201, 200, 200)",
        textAlign: "center",
        padding: "20px",
      }}>
      <div style={{ color: "#fff", fontSize: "24px", marginBottom: "20px" }}>
        Welcome, {username}
      </div>
      <div style={{ display: "inline-block" }}>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            style={{
              display: "inline-block",
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              border: "3px dotted #fff",
              margin: "0 10px",
              textAlign: "center",
              lineHeight: "35px",
              backgroundColor:
                currentDay === day ? "#FF7F50" : "rgb(201, 200, 200)",
            }}>
            {day}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <Link
          to="/library"
          className="library"
          style={{
            display: "inline-block",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: "1px solid #fff",
            marginRight: "20px",
            textAlign: "center",
            lineHeight: "100px",
            color: "#fff",
            textDecoration: "none",
          }}>
          Library
        </Link>
        <Link
          to="/profile"
          className="Profile"
          style={{
            display: "inline-block",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: "1px solid #fff",
            marginRight: "20px",
            textAlign: "center",
            lineHeight: "100px",
            color: "#fff",
            textDecoration: "none",
          }}>
          Profile
        </Link>
        <Link
          to="/community"
          className="Community"
          style={{
            display: "inline-block",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: "1px solid #fff",
            textAlign: "center",
            lineHeight: "100px",
            color: "#fff",
            textDecoration: "none",
          }}>
          Community
        </Link>
      </div>
    </div>
  );
}
