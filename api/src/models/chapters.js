/**
 * Schema representing a H4I Chapter
 */
const { Schema, model } = require('mongoose');
const { chapterEnum } = require('./members');

const statusEnum = {
  INCOMING: 'Incoming',
  INCUBATING: 'Incubating',
  MATURE: 'Mature',
  DISSOLVED: 'Dissolved',
};

const Chapter = new Schema({
  chapterName: {
    type: String,
    enum: Object.values(chapterEnum),
    required: true,
  },
  chapterEmail: { type: String, unique: true, required: true },
  currentLeadersEmail: { type: [String], required: true },
  yearFounded: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(statusEnum),
    required: true,
  },
  githubUrl: String,
  notionUrl: String,
  websiteUrl: String,
  socialUrls: [String],
  notes: String,
});

module.exports = model('Chapter', Chapter);
