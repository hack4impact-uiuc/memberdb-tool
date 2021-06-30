/**
 * Schema representing a H4I Project
 */
const { Schema, model } = require('mongoose');
const { chapterEnum } = require('./members');

const statusEnum = {
  PRODUCT_RESEARCH: 'Product Research',
  UNDER_DEVELOPMENT: 'Under Development',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  ABANDONED: 'Abandoned',
};
const timeUnitEnum = {
  SEMESTER: 'Semester',
  QUARTER: 'Quarter',
  TRIMESTER: 'Trimester',
  MONTH: 'Month',
  YEAR: 'Year',
};

const timeInDevelopment = new Schema({
  amount: Number,
  unit: {
    type: String,
    enum: Object.values(timeUnitEnum),
  },
});

const Project = new Schema({
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  chapter: {
    type: String,
    enum: Object.values(chapterEnum),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(statusEnum),
    required: true,
  },
  duration: timeInDevelopment,
  teamMembersEmail: [String],
  websiteUrl: String,
  githubUrl: String,
  figmaUrl: String,
  notes: String,
});

module.exports = model('Project', Project);
