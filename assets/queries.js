const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'staff_info'
});

const question = [
    {
        type: 'list',
        name: 'main-menu',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
    }
];

async function runMenu() {
    while(true) {
        try {
            const answer = await inquirer.prompt(question);
    
            switch (answer['main-menu']) {
                case 'View all departments':
                    await viewAllDepartments();
                    break;
                case 'View all roles':
                    await viewAllRoles();
                    break;
                case 'View all employees':
                    await viewAllEmployees();
                    break;
                case 'Quit':
                    process.exit(0);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

async function viewAllDepartments() {
    db.query('SELECT * FROM department;', (err, results) => {
        if (err) {
            console.error(err);
        }
        const formattedResults = JSON.parse(JSON.stringify(results));
        printTable(formattedResults);
        runMenu();
    });
}

async function viewAllRoles() {
    db.query('SELECT * FROM role;', (err, results) => {
        if (err) {
            console.error(err);
        }
        const formattedResults = JSON.parse(JSON.stringify(results));
        printTable(formattedResults);
        runMenu();
    });
}

async function viewAllEmployees() {
    db.query('SELECT * FROM employee;', (err, results) => {
        if (err) {
            console.error(err);
        }
        const formattedResults = JSON.parse(JSON.stringify(results));
        printTable(formattedResults);
        runMenu();
    });
}

module.exports = runMenu();