const mongoose = require('mongoose');

const statusEnum = {
    INCOMING: "INCOMING",
    INCUBATING: "INCUBATING",
    MATURE: "MATURE",
    DISSOLVED: "DISSOLVED"
}


const Chapter = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(statusEnum),
      required: true
    },
    website: { type: String, default: null },
    linkedin: { type: String, default: null },
    github: { type: String, default: null },
    notion: { type: String, default: null },
    socialUrls: { type: [String], default: null },
    leaders: [{type: mongoose.Schema.Types.ObjectId, ref: "Member"}]
  });
  
  module.exports = mongoose.model('Chapter', Chapter);