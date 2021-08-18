const express = require('express')
const router = express.Router()
const controller = require('../controllers/SyllabiController')
const { check } = require('express-validator')

var findValidation = [
    check('courseSubject')
    .isLength({ min: 3, max: 4 })
    .withMessage('Input field must be 3 or 4 characters long')
    .matches(/^[a-zA-Z]+$/)
    .withMessage('Invalid Input'),
    check('catalogNumber')
    .isLength({ min: 3, max: 3 })
    .withMessage('Input field must be 3 digits long')
    .isInt()
    .withMessage('Input field must be an Integer')
]

router.get('/', (req, res) => {
    res.render('find/index', { title: 'Find', errors: undefined })
})

router.get('/search', findValidation, controller.findSyllabus)

module.exports = router