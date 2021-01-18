const express = require('express');
const router = express.Router();
const Note = require('../models/');
const errorWrap = require('../middleware/errorWrap');
const { requireRegistered } = require('../middleware/auth');

router.get(
  '/',
  requireRegistered,
  errorWrap(async (req, res) => {}),
);

router.post(
  '/',
  requireRegistered,
  errorWrap(async (req, res) => {}),
);

router.put(
  '/:notesId',
  requireRegistered,
  errorWrap(async (req, res) => {}),
);

router.delete(
  '/:notesId',
  requireRegistered,
  errorWrap(async (req, res) => {}),
);
