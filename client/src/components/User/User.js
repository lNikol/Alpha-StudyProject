import React from "react";
import userApi from "../../http";

export default class User extends React.Component {
  constructor(user) {
    super(user);
    this.user = user;
    this.username = user.username;
  }

  sendingFile = (e) => {
    let file = e.target.files[0];
    this.uploadFile(file);
    e.target.value = "";
  };

  uploadFile = (file) => {
    let formData = new FormData();
    let user = this.user;
    formData.append("user", JSON.stringify(user));
    formData.append("userFile", file);
    userApi
      .post("createCard", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        if (err.response) {
          let existsCards = err.response.data.existsCards;
          existsCards?.length >= 1
            ? existsCards.map((i) => console.log(i))
            : console.log("");

          if (err.response.data.message) alert(err.response.data.message);
        } else {
          alert(err);
        }
      });
  };

  getExample = () => {
    userApi
      .post("sendExample", { responseType: "blob" })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "template.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((e) => console.log(e));
  };
  render() {
    return (
      <div>
        <h2>Welcome, {this.username}</h2>
        <input type="file" name="userFile" onChange={this.sendingFile} />
        <button onClick={this.getExample}>Get example</button>
      </div>
    );
  }
}
