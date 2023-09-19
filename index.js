// Import required libraries
const inquirer = require(`inquirer`);
const express = require(`express`);
const connection = require(`./config/connection`);
const Prompts = require(`./js_modules/prompts`);
const DatabaseExplorer = require(`./js_modules/queries`);

const app = express();
const prompts = new Prompts();
const explore = new DatabaseExplorer();

app.use(express.json());

const menuChoices = {
    'View all departments': explore.allDepartments,
    'View all roles': explore.allRoles,
    'View all employees': explore.allEmployees,
    'Add a new department': () => explore.newDepartment(prompts.newDpt),
    'Add a new role': () => explore.newRole(prompts.newRole),
    'Add a new employee': () => explore.newEmployee(prompts.newEmp),
    "Update an employee's role": explore.updateEmployeeRole,
    'Quit': () => {
        console.clear();
        process.exit();
    },
};

connection.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.clear();
    console.log(prompts.header)
    menu();
});

const menu = () => {
    inquirer.prompt(prompts.mainMenuList).then((result) => {
        const { choices } = result;
        const selectedFunction = menuChoices[choices];

        if(selectedFunction) {
            viewAll(selectedFunction);
        } else {
            console.clear();
            console.log(prompts.header);
            console.log(`Invalid choice. Please select a valid option.`);
            menu();
        }
    })
}

const viewAll = async (callback) => {
    try {
        await callback.call(explore);
        menu();
    } catch (error) {
        console.error(error);
    }
}