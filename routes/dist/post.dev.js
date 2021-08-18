"use strict";

var express = require('express');

var multer = require('multer');

var path = require('path');

var router = express.Router();

var controller = require('../controllers/SyllabiController');

var _require = require('express-validator'),
    check = _require.check,
    validationResult = _require.validationResult;

var storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads'),
  filename: function filename(req, file, cb) {
    return cb(null, "".concat(req.body.courseSubject.toUpperCase(), "_").concat(req.body.catalogNumber, "_").concat(req.body.semester, "_").concat(req.body.year).concat(path.extname(file.originalname)));
  }
});
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: function fileFilter(req, file, cb) {
    if (file.mimetype !== 'application/pdf' && file.mimetype !== 'application/msword' && file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      req.fileValidationError = 'Input field must be either a pdf or doc or docx';
      cb(null, false);
    } else if (controller.findByFilename) {
      req.fileValidationError = 'Syllabus Already exists / required fields are empty';
      cb(null, false);
    } else {
      cb(null, true);
    }
  }
}).single('file');

function uploadFile(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).render('error', {
        title: 'Result',
        heading: '422',
        sub_heading: 'File too Large',
        info: 'Thank you for your contribution, but the file you submitted is too large.'
      });
    }

    next();
  });
}

var postValidation = [check('courseSubject').isLength({
  min: 3,
  max: 4
}).withMessage('Input field must be 3 or 4 characters long').matches(/^[a-zA-Z]+$/).withMessage('Invalid Input'), check('catalogNumber').isLength({
  min: 3,
  max: 3
}).withMessage('Input field must be 3 digits long').isInt().withMessage('Input field must be an Integer'), check('semester').exists().withMessage('Input field can not be empty'), check('year').exists().withMessage('Input field can not be empty')];
router.get('/', function (req, res) {
  res.render('./post/index', {
    title: 'Post',
    errors: undefined
  });
});
router.post('/insert', uploadFile, postValidation, controller.create);
module.exports = router;