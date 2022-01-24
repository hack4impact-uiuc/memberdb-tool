const { isValidChapter } = require("../utils/chapters");

/*
Require that the 'chapter' param is either a valid chapter code or 'all' to signify all chapters
*/
function requireValidChapterOrAllChapters(req, res, next) {
    if (!req.params.chapter) {
        return res.status(400).json({
            success: false,
            message: "No chapter specified."
        })
    }
    const { chapter } = req.params;
    return (chapter === "all" || isValidChapter(chapter)) ? next()
    : res.status(404).json({
        success: false,
        message: `${chapter} is not a valid chapter.`
    })
}

module.exports.requireValidChapterOrAllChapters = requireValidChapterOrAllChapters;