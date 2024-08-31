const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    requred: true,
  },
  userName: {
    type: String,
    requred: true,
    unique: false,
  },
  email: {
    type: String,
    requred: true,
    unique: true,
  },
  password: {
    type: String,
    requred: true,
  },
  role: {
    type: String,
    default: "user",
  },
});

const user = mongoose.model("user", userSchema);
module.exports = user;
