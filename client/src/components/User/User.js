import React from "react";
import userApi from "../../http";

export default class User extends React.Component {
  constructor(user) {
    super(user);

    this.username = user.username;
  }

  sendingFile = (e) => {
    let file = e.target.files[0];
    this.uploadFile(file);
    e.target.value = "";
  };

  uploadFile = (file) => {
    let formData = new FormData();
    formData.append("userFile", file);
    console.log(this.getReq);
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

  render() {
    return (
      <div>
        <h2>Welcome, {this.username}</h2>
        <input type="file" name="userFile" onChange={this.sendingFile} />
        <form
          action="http://localhost:5000/user/sendExample"
          method="post"
          encType="multipart/form-data">
          <input type="submit" value="Get example" />
        </form>
      </div>
    );
  }
}
