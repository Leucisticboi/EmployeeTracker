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

// Initialize list of potential menu choices with corresponding functions to run
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

// Start server connection
connection.connect((err) => {
    // Check for connection errors
    if (err) {
        console.error(err);
        return;
    }
    console.clear();
    console.log(prompts.header)
    menu();
});

// Initialize 'menu' function
const menu = () => {
    // Begin by running an inquirer prompt using 'mainMenuList'
    inquirer.prompt(prompts.mainMenuList).then((result) => {
        // Deconstruct 'choices' variable from the prompt result
        const { choices } = result;
        // Initialize 'selectedFunction' variable using the 'choices' to select from the 'menuChoices' array
        const selectedFunction = menuChoices[choices];

        // Make sure 'selectedFunction' exists
        if(selectedFunction) {
            // Pass 'selectedFunction' to 'viewAll' function
            viewAll(selectedFunction);
        } else {
            // If 'selectedFunction' is null, restart application and prompt user to select a menu option
            console.clear();
            console.log(prompts.header);
            console.log(`Invalid choice. Please select a valid option.`);
            menu();
        }
    })
}

// Initialize 'viewAll' async function
const viewAll = async (callback) => {
    try {
        await callback.call(explore);
        menu();
    } catch (error) {
        console.error(error);
    }
}