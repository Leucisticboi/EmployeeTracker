// Import required libraries
const inquirer = require(`inquirer`);
const express = require(`express`);
const connection = require(`./config/connection`);
const { printTable } = require(`console-table-printer`);

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connection.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Connected to 'employees' database.`)
    menu();
});

const menu = () => {
    inquirer.prompt([
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
                `Quit`
            ]
        }
    ])
    .then((result) => {
        const { choices } = result;

        if (choices === 'View all departments') {
            viewAllDepartments();
        } else if (choices === 'View all roles') {
            viewAllRoles();
        } else if (choices === 'View all employees') {
            viewAllEmployees();
        } else if (choices === 'Add a new department') {
            inquirer.prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'What is the name of this new department?',
                }
            ])
            .then((newDpt) => {
                addNewDepartment(newDpt);
            })
        } else if (choices === 'Add a new role') {
            inquirer.prompt([
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
            ])
            .then((answer) => {
                const newRole = {};
                newRole.title = answer.title;
                newRole.salary = answer.salary;
                connection.query(`SELECT d.name AS department FROM department d;`, (err, res) => {
                    if (err) {
                        console.error(err)
                    } else if (res.length > 0) {
                        const formattedDeptName = res.map(({ department }) => ({ value: department }));
                        inquirer.prompt([
                            {
                                name: `department`,
                                type: `list`,
                                message: `Which department does this role belong to?`,
                                choices: formattedDeptName
                            }
                        ])
                        .then((answer) => {
                            newRole.department = answer.department;
                            addNewRole(newRole);
                        });
                    }
                });
            });
        } else if (choices === `Add a new employee`) {
            inquirer.prompt([
                {
                    name: `first_name`,
                    type: `input`,
                    message: `What is the employee's first name?`
                },
                {
                    name: `last_name`,
                    type:  `input`,
                    message: `What is the employee's last name?`
                }
            ])
            .then((answer) => {
            const newEmployee = {};
            newEmployee.first_name = answer.first_name;
            newEmployee.last_name = answer.last_name;
            connection.query(`SELECT r.title FROM role r;`, (err, res) => {
                if (err) {
                    console.error(err);
                } else if (res.length > 0) {
                    const formattedResults = res.map(({ title }) => ({ value: title }));
                    inquirer.prompt([
                        {
                            name: `role`,
                            type: `list`,
                            choices: formattedResults
                        }
                    ])
                    .then((answer) => {
                        newEmployee.role = answer.role;
                        connection.query(`SELECT CONCAT(e.first_name, " ", e.last_name) AS manager FROM employee e WHERE manager_id IS null;`, (err, res) => {
                            if (err) {
                                console.error(err);
                            } else if (res.length > 0) {
                                const formattedResults2 = res.map(({ manager }) => ({ value: manager }));
                                formattedResults2.push(`null`);
                                inquirer.prompt([
                                    {
                                        name: `manager`,
                                        type: `list`,
                                        message: `Who is this employee's manager?`,
                                        choices: formattedResults2
                                    }
                                ])
                                .then((answer) => {
                                    let manager = answer.manager.split(` `)[0];
                                    newEmployee.manager = manager;
                                    addNewEmployee(newEmployee);
                                });
                            }
                        });
                    });
                }
            });
        })
        } else if (choices === `Update an employee's role`) {
            updateEmployeeRole();
        } else if (choices === `Quit`) {
            process.exit();
        }
    });
}

const viewAllDepartments = () => {
    connection.query(`SELECT d.id, d.name AS department FROM department d;`, (err, res) => {
        if (err) {
            console.error(err);
        } else if (res.length > 0) {
            let formattedResults = JSON.parse(JSON.stringify(res));
            console.clear();
            printTable(formattedResults);
            menu();
        }
    });
}

const viewAllRoles = () => {
    connection.query('SELECT r.title AS job_title, d.name AS department, r.salary FROM role r JOIN department d ON r.department_id = d.id;', (err, res) => {
        if (err) {
            console.error(err);
        } else if (res.length > 0) {
            let formattedResults = JSON.parse(JSON.stringify(res));
            console.clear();
            printTable(formattedResults);
            menu();
        }
    });
}

const viewAllEmployees = () => {
    connection.query(`SELECT e.id, CONCAT(e.first_name, " ",e.last_name) AS employee_name, r.title AS role, d.name AS department, r.salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id ORDER BY e.id ASC;`, (err, res) => {
        if (err) {
            console.error(err);
        } else if (res.length > 0) {
            let formattedResults = JSON.parse(JSON.stringify(res));
            console.clear();
            printTable(formattedResults);
            menu();
        }
    });
}

const addNewDepartment = (newDpt) => {
    const { title } = newDpt;
    connection.query('INSERT INTO department (name) VALUES (?);', title, (err) => {
        if (err) {
            console.error(err);
        }
        console.log(`The table has been updated to include ${title}!`);
        menu();
    });
}

const addNewRole = (newRole) => {
    const { title, salary, department } = newRole;
    connection.query('SELECT d.id FROM department d WHERE name = (?);', department, (err, res) => {
        if (err) {
            console.error(err);
        } else if (res.length > 0) {
            const department_id = res[0].id;

            connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [title, salary, department_id], (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`The role table has been updated to include ${title}!`);
                    menu();
                }
            });
        }
    });
}

const addNewEmployee = (newEmployee) => {
    const { first_name, last_name, role, manager } = newEmployee;
    connection.query(`SELECT r.id AS id FROM role r WHERE title = ?;`, [role], (err, res) => {
        if (err) {
            console.error(err);
        } else {
            const role_id = res[0].id;
            if (manager === 'null') {
                connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?);`, [first_name, last_name, role_id], (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`The employee table has been updated to include ${first_name + ' ' + last_name}'s information!`)
                        menu();
                    }
                });
            } else {
                connection.query(`SELECT e.id AS id FROM employee e WHERE first_name = ?;`, [manager], (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        const manager_id = res[0].id;
                        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [first_name, last_name, role_id, manager_id], (err) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(`The employee table has been updated to include ${first_name + ' ' + last_name}'s information!`);
                                menu();
                            }
                        });
                    }
                });
            }
        }
    });
}

const updateEmployeeRole = () => {

}