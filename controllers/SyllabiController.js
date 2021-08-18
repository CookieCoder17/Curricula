const Syllabus = require('../models/Syllabus')
const { validationResult } = require('express-validator')

// CREATE
exports.create = (req, res) => {
    const errors = validationResult(req)
    const File = req.file
    if (!errors.isEmpty() || !File) {
        if (!errors.isEmpty() && File) {
            return res.status(422).render('./post/index', {
                title: 'Post',
                errors: errors.mapped()
            })
        }
        if (!errors.isEmpty() && !File) {
            var file = {
                value: '',
                msg: req.fileValidationError || 'Input field cannot be empty',
                param: 'file',
                location: 'file'
            }
            var customError = {...errors.mapped(), file }
            return res.status(422).render('./post/index', {
                title: 'Post',
                errors: customError
            })
        }
        if (errors.isEmpty() && !File) {
            var file = {
                value: '',
                msg: req.fileValidationError || 'Input field cannot be empty',
                param: 'file',
                location: 'file'
            }
            var customError = {...errors.mapped(), file }
            return res.status(422).render('./post/index', {
                title: 'Post',
                errors: customError
            })
        }
    }
    const newSyllabus = new Syllabus({
        courseSubject: req.body.courseSubject,
        catalogNumber: req.body.catalogNumber,
        filename: req.file.filename,
        year: req.body.year,
        semester: req.body.semester
    })

    Syllabus.create(newSyllabus, (err, data) => {
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
            })
        } else {
            if (err.code == 'ER_DUP_ENTRY') {
                res.status(400).render('error', {
                    title: 'Result',
                    heading: '400',
                    sub_heading: 'Syllabus Already Exists',
                    info: 'Thank you for your contribution, but the syllabus you submitted is already available in the database.'
                })
            } else {
                res.status(500).render('error', {
                    title: 'Result',
                    heading: '500',
                    sub_heading: 'sorry for the inconvenience :(',
                    info: 'Thank you for your contribution, but an error has ocurred from our side. Please try again later.'
                })
            }
        }
    })
}

// READ
exports.findSyllabus = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('./find/index', {
            title: 'Find',
            errors: errors.mapped()
        })
    }
    Syllabus.findSyllabus(
        req.query.courseSubject,
        req.query.catalogNumber,
        (err, data) => {
            if (!err) {
                res.status(200).render('./find/show', {
                    title: 'Results',
                    data: data
                })
            } else {
                if (err.kind == 'not_found') {
                    res.status(404).render('error', {
                        title: 'Result',
                        heading: '404',
                        sub_heading: 'Syllabus Not Found',
                        info: 'Sorry, the syllabus does not exist in the database. Please try again later, or contribute by posting the syllabus once you find it :)'
                    })
                } else {
                    res.status(500).render('error', {
                        title: 'Result',
                        heading: '500',
                        sub_heading: 'sorry for the inconvenience :(',
                        info: 'Thank you for your contribution, but an error has ocurred from our side. Please try again later.'
                    })
                }
            }
        }
    )
}

exports.findByFilename = filename => {
    Syllabus.findByFilename(filename, (err, data) => {
        if (err.kind === 'exists') {
            return true
        } else {
            return false
        }
    })
}