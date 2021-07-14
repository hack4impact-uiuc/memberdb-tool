const express = require('express');
const { requireDirector } = require('../middleware/auth');
const errorWrap = require('../middleware/errorWrap');
const router = express.Router();
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

module.exports = router;
