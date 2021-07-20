const express = require('express');
const { requireDirector } = require('../middleware/auth');
const errorWrap = require('../middleware/errorWrap');
const router = express.Router();
const Member = require('../models/members');
const Project = require('../models/projects');

router.delete(
  '/:id',
  requireDirector,
  errorWrap(async (req, res) => {
    const id = req.params.id;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    await Project.delete({ _id: id });
    return res.json({
      success: true,
      message: 'Successfully deleted project',
    });
  }),
);

router.get(
  '/chapter/:chapter',
  errorWrap(async (req, res) => {
    if (!Object.keys(Member.chapterEnum).includes(req.params.chapter)) {
      return res.status(404).json({
        success: false,
        message: req.params.chapter + ' is not a valid chapter.',
      });
    }
    res.json({
      success: true,
      result: Project.find({ chapter: Member.chapterEnum[req.params.chapter] }),
    });
  })
)

module.exports = router;
