const express = require("express");
const mongoose = require("mongoose");
const coockieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ndndf.mongodb.net/`
  )
  .then(() => console.log("MongDB Connected"))
  .catch((error) => console.log(error));
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(coockieParser());
app.use(express.json());
app.use("/api/auth", authRouter);

app.listen(port, () => console.log(`SERVER IS RUNNING ON PORT ${port}`));
