// Import required libraries
const inquirer = require('inquirer');
const table = require('console.table');
const connection = require('./config/connection');

connection.connect((err) => {
    if (err) {
        console.error(err);
    }
});

const menu = () => {
    inquirer.prompt([
        {
            name: 'menu',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Quit'
            ]
        }
    ])
    .then((answers) => {
        const { choice } = answers;

        if (choice === 'View all departments') {
            viewAllDepartments();
        } else if (choice === 'View all roles') {
            viewAllRoles();
        } else if (choice === 'View all employees') {
            viewAllEmployees();
        } else if (choice === 'Add a department') {
            addADepartment();
        } else if (choice === 'Add a role') {
            addARole();
        } else if (choice === 'Add an employee') {
            addAnEmployee();
        } else if (choice === 'Update an employee role') {
            updateEmployeeRole();
        } else {
            process.exit();
        }
    })
}