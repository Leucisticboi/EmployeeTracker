// Import required libraries
const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');
const { runMenu } = require('./assets/queries');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'staff_info'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.message);
        return;
    }
    console.log(`Connected to staff database`);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    runMenu();

});
