"use strict";

var express = require('express');

var router = express.Router();

var controller = require('../controllers/SyllabiController');

var _require = require('express-validator'),
    check = _require.check;

var findValidation = [check('courseSubject').isLength({
  min: 3,
  max: 4
}).withMessage('Input field must be 3 or 4 characters long').matches(/^[a-zA-Z]+$/).withMessage('Invalid Input'), check('catalogNumber').isLength({
  min: 3,
  max: 3
}).withMessage('Input field must be 3 digits long').isInt().withMessage('Input field must be an Integer')];
router.get('/', function (req, res) {
  res.render('find/index', {
    title: 'Find',
    errors: undefined
  });
});
router.get('/search', findValidation, controller.findSyllabus);
module.exports = router;