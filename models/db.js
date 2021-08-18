const config = require('../config/config')
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

connection.connect((err) => {
    if (!err) {
        console.log(`Successfully connected ${config.database}`)
    } else {
        console.log(err)
    }
})

module.exports = connection