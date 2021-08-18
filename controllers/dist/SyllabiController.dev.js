"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Syllabus = require('../models/Syllabus');

var _require = require('express-validator'),
    validationResult = _require.validationResult; // CREATE


exports.create = function (req, res) {
  var errors = validationResult(req);
  var File = req.file;

  if (!errors.isEmpty() || !File) {
    if (!errors.isEmpty() && File) {
      return res.status(422).render('./post/index', {
        title: 'Post',
        errors: errors.mapped()
      });
    }

    if (!errors.isEmpty() && !File) {
      var file = {
        value: '',
        msg: req.fileValidationError || 'Input field cannot be empty',
        param: 'file',
        location: 'file'
      };

      var customError = _objectSpread({}, errors.mapped(), {
        file: file
      });

      return res.status(422).render('./post/index', {
        title: 'Post',
        errors: customError
      });
    }

    if (errors.isEmpty() && !File) {
      var file = {
        value: '',
        msg: req.fileValidationError || 'Input field cannot be empty',
        param: 'file',
        location: 'file'
      };

      var customError = _objectSpread({}, errors.mapped(), {
        file: file
      });

      return res.status(422).render('./post/index', {
        title: 'Post',
        errors: customError
      });
    }
  }

  var newSyllabus = new Syllabus({
    courseSubject: req.body.courseSubject,
    catalogNumber: req.body.catalogNumber,
    filename: req.file.filename,
    year: req.body.year,
    semester: req.body.semester
  });
  Syllabus.create(newSyllabus, function (err, data) {
    if (!err) {
      res.status(201).render('./post/show', {
        title: 'Result',
        heading: '201',
        sub_heading: 'Syllabus successfully inserted :)',
        cs: data.courseSubject,
        cn: data.catalogNumber,
        fn: data.filename,
        sem: data.semester,
        y: data.year
      });
    } else {
      if (err.code == 'ER_DUP_ENTRY') {
        res.status(400).render('error', {
          title: 'Result',
          heading: '400',
          sub_heading: 'Syllabus Already Exists',
          info: 'Thank you for your contribution, but the syllabus you submitted is already available in the database.'
        });
      } else {
        res.status(500).render('error', {
          title: 'Result',
          heading: '500',
          sub_heading: 'sorry for the inconvenience :(',
          info: 'Thank you for your contribution, but an error has ocurred from our side. Please try again later.'
        });
      }
    }
  });
}; // READ


exports.findSyllabus = function (req, res) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('./find/index', {
      title: 'Find',
      errors: errors.mapped()
    });
  }

  Syllabus.findSyllabus(req.query.courseSubject, req.query.catalogNumber, function (err, data) {
    if (!err) {
      res.status(200).render('./find/show', {
        title: 'Results',
        data: data
      });
    } else {
      if (err.kind == 'not_found') {
        res.status(404).render('error', {
          title: 'Result',
          heading: '404',
          sub_heading: 'Syllabus Not Found',
          info: 'Sorry, the syllabus does not exist in the database. Please try again later, or contribute by posting the syllabus once you find it :)'
        });
      } else {
        res.status(500).render('error', {
          title: 'Result',
          heading: '500',
          sub_heading: 'sorry for the inconvenience :(',
          info: 'Thank you for your contribution, but an error has ocurred from our side. Please try again later.'
        });
      }
    }
  });
};

exports.findByFilename = function (filename) {
  Syllabus.findByFilename(filename, function (err, data) {
    if (err.kind === 'exists') {
      return true;
    } else {
      return false;
    }
  });
};