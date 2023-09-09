const mainMenuList = [
    {
        name: `choices`,
        type: `list`,
        message: `What would you like to do?`,
        choices: [
            `View all departments`,
            `View all roles`,
            `View all employees`,
            `Add a new department`,
            `Add a new role`,
            `Add a new employee`,
            `Update an employee's role`,
            `Quit`,
        ]
    }
];

const addNewDpt = [
    {
        name: 'title',
        type: 'input',
        message: 'What is the name of this new department?',
    }
];

const addNewRoleQ = [
    {
        name: 'title',
        type: 'input',
        message: 'What is the name of this new role?'
    },
    {
        name: `salary`,
        type: `input`,
        message: 'What is the salary for this role?'
    }
];

module.exports = { mainMenuList, addNewDpt, addNewRoleQ };