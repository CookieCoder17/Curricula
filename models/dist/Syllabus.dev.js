"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sql = require('./db');

var Syllabus = function Syllabus(newSyllabus) {
  this.courseSubject = newSyllabus.courseSubject;
  this.catalogNumber = newSyllabus.catalogNumber;
  this.filename = newSyllabus.filename;
  this.year = newSyllabus.year;
  this.semester = newSyllabus.semester;
};

Syllabus.create = function (newSyllabus, result) {
  sql.query("INSERT INTO syllabi SET ?", newSyllabus, function (err, res) {
    if (!err) {
      result(null, _objectSpread({}, newSyllabus));
      return;
    } else {
      result(err, null);
      return;
    }
  });
};

Syllabus.findSyllabus = function (courseSubject, catalogNumber, result) {
  sql.query("SELECT * FROM syllabi WHERE courseSubject=\"".concat(courseSubject, "\" AND catalogNumber=\"").concat(catalogNumber, "\""), function (err, res) {
    if (!err) {
      if (res.length) {
        result(null, res);
        return;
      } else {
        result({
          kind: "not_found"
        }, null);
        return;
      }
    } else {
      result(err, null);
      return;
    }
  });
};

Syllabus.findByFilename = function (filename, result) {
  sql.query("SELECT * FROM syllabi WHERE filename=\"".concat(filename, "\""), function (err, res) {
    if (res.length) {
      result({
        kind: "exists"
      }, null);
      return;
    } else {
      result(null, res);
      return;
    }
  });
};

module.exports = Syllabus;