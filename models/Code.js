const mongoose = require("mongoose");

delete mongoose.connection.models["code"];

const codeSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.models.Code || mongoose.model("code", codeSchema);
