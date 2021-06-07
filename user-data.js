const mongoose = require("mongoose");

const userdata = new mongoose.Schema({
    name: String,
    username: String,
    passward: String
  });

module.exports = new mongoose.model('userData', userdata);
