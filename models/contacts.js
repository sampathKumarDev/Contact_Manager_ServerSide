const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  user: String,
  company: String,
  country: String,
  name: String,
  email: String,
  phone: String,
  industry: String,
  designation: String
});

const contacts = mongoose.model("contacts", contactSchema);

module.exports = contacts;