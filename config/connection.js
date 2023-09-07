const mysql = require('mysql2');

const connect = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'employees'
});

module.exports = connect;
