const question = [
    {
        type: 'list',
        name: 'main-menu',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    }
];

const menu = await inquirer.createPromptModule(question);

module.exports = menu;