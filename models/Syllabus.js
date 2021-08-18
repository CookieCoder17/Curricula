const sql = require('./db');

const Syllabus = function(newSyllabus) {
    this.courseSubject = newSyllabus.courseSubject
    this.catalogNumber = newSyllabus.catalogNumber
    this.filename = newSyllabus.filename
    this.year = newSyllabus.year
    this.semester = newSyllabus.semester
}

Syllabus.create = (newSyllabus, result) => {
    sql.query(`INSERT INTO syllabi SET ?`, newSyllabus, (err, res) => {
        if (!err) {
            result(null, {...newSyllabus })
            return
        } else {
            result(err, null)
            return
        }
    })
}

Syllabus.findSyllabus = (courseSubject, catalogNumber, result) => {
    sql.query(`SELECT * FROM syllabi WHERE courseSubject="${courseSubject}" AND catalogNumber="${catalogNumber}"`, (err, res) => {
        if (!err) {
            if (res.length) {
                result(null, res)
                return
            } else {
                result({ kind: "not_found" }, null)
                return
            }
        } else {
            result(err, null)
            return
        }
    })
}

Syllabus.findByFilename = (filename, result) => {
    sql.query(`SELECT * FROM syllabi WHERE filename="${filename}"`, (err, res) => {
        if (res.length) {
            result({ kind: "exists" }, null)
            return
        } else {
            result(null, res)
            return
        }
    })
}

module.exports = Syllabus