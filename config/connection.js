const mysql = require('mysql2');

const connect = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: '',
    database: 'staff_info'
});

module.exports = connect;
