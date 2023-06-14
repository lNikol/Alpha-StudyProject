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
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f0f0f0",
      }}>
      <div style={{ color: "black", fontSize: "24px", marginBottom: "20px" }}>
        Welcome, {username}
      </div>
      <div
        style={{
          display: "inline-block",
        }}>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            style={{
              display: "inline-block",
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              border: "3px dotted black",
              margin: "0 10px",
              textAlign: "center",
              lineHeight: "30px",
              padding: "3px",
              backgroundColor: currentDay === day ? "#F1B449" : "",
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
            border: "1px solid black",
            marginRight: "20px",
            textAlign: "center",
            lineHeight: "100px",
            color: "#fff",
            background: "#EFA31C",
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
            border: "1px solid black",
            marginRight: "20px",
            textAlign: "center",
            lineHeight: "100px",
            color: "#fff",
            background: "#EFA31C",
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
            border: "1px solid black",
            textAlign: "center",
            lineHeight: "100px",
            color: "#fff",
            background: "#EFA31C",
            textDecoration: "none",
          }}>
          Community
        </Link>
      </div>
    </div>
  );
}
