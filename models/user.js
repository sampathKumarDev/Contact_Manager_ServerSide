const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user: String,
  password: String,
});

const user = mongoose.model("user", userSchema);

module.exports = user;