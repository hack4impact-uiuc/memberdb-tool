const { chapterEnum } = require("../models/members");

function isValidChapter(chapter) {
    return Object.keys(chapterEnum).includes(chapter);
}

module.exports.isValidChapter = isValidChapter