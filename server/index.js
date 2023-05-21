const { template_path, connect } = require("./config");
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const cors = require("cors");
const urlencodedParser = express.urlencoded({ extended: false });
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.post("/sendExample", urlencodedParser, (req, res) => {
  res.download(path.join(template_path));
});
app.post("/test", (req, res) => {
  console.log(req);
});
const start = async () => {
  try {
    await mongoose.connect(connect);
    app.listen(PORT, () => console.log(`localhost:${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
