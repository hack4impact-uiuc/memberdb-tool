const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { requireDirector } = require('../middleware/auth');
const errorWrap = require('../middleware/errorWrap');
const router = express.Router();
const Member = require('../models/members');
const Project = require('../models/projects');

const validateProjectQuery = (mode) => {
  const allValidations = [
    body('projectName').if(body('projectName').exists()).notEmpty(),
    body('description').if(body('description').exists()).notEmpty(),
    body('chapter').if(body('chapter').exists()).notEmpty(),
    body('status').if(body('status').exists()).notEmpty(),
    body('websiteUrl').if(body('websiteUrl').exists()).isURL(),
    body('githubUrl').if(body('github').exists()).isURL(),
    body('figmaUrl').if(body('notion').exists()).isURL(),
    body('teamMembersEmail').if(body('teamMembersEmail').exists()).isArray(),
  ];

  const validationCollector = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    } else next();
  };

  switch (mode) {
    case 'UPDATE':
      return [
        param('id').exists().isMongoId(),
        ...allValidations,
        validationCollector,
      ];
    case 'CREATE':
      return [...allValidations, validationCollector];
    case 'DELETE':
      return [param('id').exists().isMongoId(), validationCollector];
    default:
      throw new Error(
        "Incorrect mode passed into validation middleware for Projects. Please pass in: 'CREATE', 'UPDATE', or 'DELETE'.",
      );
  }
};

router.delete(
  '/:id',
  requireDirector,
  validateProjectQuery('DELETE'),
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
  '/:chapter',
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
  }),
);

router.post(
  '/',
  requireDirector,
  validateProjectQuery('CREATE'),
  errorWrap(async (req, res) => {
    const project = await Project.create(req.body);
    return res.status(200).json({
      success: true,
      result: project,
    });
  }),
);

router.put(
  '/:id',
  requireDirector,
  validateProjectQuery('UPDATE'),
  errorWrap(async (req, res) => {
    let project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (project) {
      res.status(200).json({
        success: true,
        result: project.toObject(),
        message: 'Project modfied',
      });
    } else
      res.status(400).json({
        success: false,
        message: 'Project not found',
      });
  }),
);

module.exports = router;
