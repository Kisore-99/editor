const mongoose = require("mongoose");

if (mongoose.connection) {
  delete mongoose.connection.models["code"];
}

const codeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fontFamily: {
    type: String,
    required: true,
  },
  fontSize: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.models.Code || mongoose.model("code", codeSchema);
