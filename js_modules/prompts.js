class Prompts {
    constructor () {
        this.header = `
        ╔════════════════════════════════════╗
        ║      Database Explorer             ║
        ╚════════════════════════════════════╝
        `;

        // Prompt with choices for application's main menu
        this.mainMenuList = [
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

        // Prompt for name of new department
        this.newDpt = [
            {
                name: 'title',
                type: 'input',
                message: 'What is the name of this new department?',
            }
        ];

        // Prompt for name and salary of new role
        this.newRole = [
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

        // Prompt for first and last name of new employee
        this.newEmp = [
            {
                name: 'first_name',
                type: 'input',
                message: `What is the employee's first name?`,
            },
            {
                name: 'last_name',
                type: 'input',
                message: `What is the employee\'s last name?`,
            },
        ];
    }
}

// Export Prompts class
module.exports = Prompts;
