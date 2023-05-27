const { connect, client_url } = require("./config");

const express = require("express");
const upload = require("express-fileupload");
const mongoose = require("mongoose");

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const cardRouter = require("./routers/cardRouter");
const fileRouter = require("./routers/fileRouter");
const studySetRouter = require("./routers/studySetRouter");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorMiddleware = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    credentials: true,
    origin: client_url,
  })
);

app.use(upload());
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/card", cardRouter);
app.use("/files", fileRouter);
app.use("/studyset", studySetRouter);

app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(connect);
    app.listen(PORT, () => console.log(`localhost:${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
