const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
    name: String,
    crop: String,
    requirnemt: String,
    email: String,
    amount: String,
    comments: String,
    img:{
      data: Buffer,
      contentType: String
    }
  });

module.exports = new mongoose.model('contracters', contractSchema);
