/**
 * Schema representing notes
 */
const mongoose = require('mongoose');

const actions = {
  CREATED: 'CREATED',
  EDITED: 'EDITED',
};


const Notes = new mongoose.Schema({
  content: { type: String, default: null},
  metaData: {
    title: { type: String, default: null }, 
    labels: { type: [String], default: null },
    referencedMembers: { type: [String], default: null},
    versionHistory: [{
        default: null,
        date: { type: Date, default: null},
        memberID: {type: String, default: null},
        action: {
            type: String, 
            enum: Object.values(actions),
            default: actions.CREATED,
        },
    }],
    access: {
        viewableBy: {type: [String], default: null},
        editableBy: {type: [String], default: null},
    }
  },
});


module.exports = mongoose.model('Notes', Notes);
module.exports.actions = actions;
