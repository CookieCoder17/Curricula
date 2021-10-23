const express = require('express')
const path = require('path')
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')

const app = express()

// Views setup 
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// URL encoding
app.use(bodyParser.urlencoded({ extended: false }))

// JSON encoding
app.use(bodyParser.json())

// Routes 
const home = require('./routes/home')
const find = require('./routes/find')
const post = require('./routes/post')
const about = require('./routes/about')

// Redirect to home page
app.get('/', (req, res) => {
    res.redirect('/home')
})

// Load router modules
app.use('/home', home)
app.use('/find', find)
app.use('/post', post)
app.use('/about', about)

// Error page if route doesnt match any of the provided routes
app.use((req, res) => {
    res.status(404).render('error', {
        title: "Error 404",
        heading: "404",
        sub_heading: "Page Not Found",
        info: "The Page you are looking for doesn't exist or an error occured."
    })
})

app.listen(port, (err) => {
    if (!err) {
        console.log(`Listening to port ${port}`)
    } else {
        console.log(err.message)
    }
})
