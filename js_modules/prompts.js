class Prompts {
    constructor () {
        this.header = `
        ╔════════════════════════════════════╗
        ║      Database Explorer             ║
        ╚════════════════════════════════════╝
        `;

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

        this.newDpt = [
            {
                name: 'title',
                type: 'input',
                message: 'What is the name of this new department?',
            }
        ];

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



module.exports = Prompts;