const { printTable } = require(`console-table-printer`);
const connection = require(`../config/connection`);
const inquirer = require(`inquirer`);

class DatabaseExplorer {
    constructor() {
        this.header = `
        ╔════════════════════════════════════╗
        ║      Database Explorer             ║
        ╚════════════════════════════════════╝
        `;
    }

        async consolePrinters (res) {
            let formattedResults = JSON.parse(JSON.stringify(res));
                    console.clear();
                    console.log(this.header);
                    printTable(formattedResults);
        }
        
        async allDepartments () {
            return new Promise((resolve, reject) => {
                connection.query(`SELECT d.id, d.name AS department FROM department d;`, (err, res) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else if (res.length > 0) {
                        this.consolePrinters(res);
                        resolve();
                    }
                });
            });
        }
        
        async allRoles () {
            return new Promise((resolve, reject) => {
                connection.query('SELECT r.title AS job_title, d.name AS department, r.salary FROM role r JOIN department d ON r.department_id = d.id;', (err, res) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else if (res.length > 0) {
                        this.consolePrinters(res);
                        resolve();
                    }
                });
            })
        }
        
        async allEmployees () {
            return new Promise((resolve, reject) => {
                connection.query(`SELECT * FROM employee;`, (err, res) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else if (res.length > 0) {
                        this.consolePrinters(res);
                        resolve();
                    }
                });
            });
        }
        
        async newDepartment (prompt) {
            console.clear();
            console.log(this.header);
            try {
                const answers = await inquirer.prompt(prompt);
                const title = answers.title;
        
                let managers = [];
        
                // Query departments and populate the global variable
                await new Promise((resolve, reject) => {
                    connection.query(`SELECT CONCAT(e.first_name, " ", e.last_name) AS manager FROM employee e WHERE manager_id IS null;`, (err, res) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else if (res.length > 0) {
                            managers = res.map(({ manager }) => ({ value: manager }));
                            managers.push(`null`);
                        }
                        resolve();
                    });
                });
        
                const { manager_id } = await inquirer.prompt([
                    {
                        name: 'manager_id',
                        type: 'list',
                        message: 'Who is the manager for this department?',
                        choices: managers,
                    }
                ]);
            
                return new Promise((resolve, reject) => {
                    connection.query(`INSERT INTO department (name) VALUES (?);`, [title, manager_id], (err) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.clear();
                            console.log(this.header);
                            console.log(`The table has been updated to include ${title}!`);
                            resolve();
                        }
                    });
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
        
        async newRole (prompt) {
            console.clear();
            console.log(this.header);
        
            try {
                // Prompt for role title and salary
                const { title, salary } = await inquirer.prompt(prompt);
        
                // Declare departments as a global variable
                let departments = [];
        
                // Query departments and populate the global variable
                await new Promise((resolve, reject) => {
                    connection.query(`SELECT d.name AS department FROM department d;`, (err, res) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else if (res.length > 0) {
                            departments = res.map(({ department }) => ({ value: department }));
                        }
                        resolve();
                    });
                });
        
                // Prompt for department selection
                const { department } = await inquirer.prompt([
                    {
                        name: 'department',
                        type: 'list',
                        message: 'Which department does this role belong to?',
                        choices: departments,
                    }
                ]);
        
                // Get the department ID
                const [departmentRow] = await connection.promise().query('SELECT d.id FROM department d WHERE name = ?;', department);
                const id = departmentRow[0]?.id;
        
                return new Promise((resolve, reject) => {
                    // Insert the new role into the database
                    connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [title, salary, id], (err) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.clear();
                            console.log(this.header);
                            console.log(`The role table has been updated to include ${title}!`);
                            resolve();
                        }
                    });
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
        
        async newEmployee (prompt) {
            try {
                const employeeAnswers = await inquirer.prompt(prompt);
        
                const newEmployee = {
                    first_name: employeeAnswers.first_name,
                    last_name: employeeAnswers.last_name,
                };
        
                const roles = await new Promise((resolve, reject) => {
                    connection.query('SELECT r.title FROM role r;', (err, res) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            const formattedResults = res.map(({ title }) => title);
                            resolve(formattedResults);
                        }
                    });
                });
        
                const roleAnswer = await inquirer.prompt([
                    {
                        name: 'role',
                        type: 'list',
                        choices: roles,
                    },
                ]);
        
                newEmployee.role = roleAnswer.role;
        
                const managers = await new Promise((resolve, reject) => {
                    connection.query('SELECT CONCAT(e.first_name, " ", e.last_name) AS manager FROM employee e WHERE manager_id IS null;', (err, res) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            const formattedResults = res.map(({ manager }) => manager);
                            formattedResults.push('null');
                            resolve(formattedResults);
                        }
                    });
                });
        
                const managerAnswer = await inquirer.prompt([
                    {
                        name: 'manager',
                        type: 'list',
                        message: 'Who is this employee\'s manager?',
                        choices: managers,
                    },
                ]);
        
                let manager = managerAnswer.manager === 'null' ? null : managerAnswer.manager.split(' ')[0];
                newEmployee.manager = manager;
        
                await this.addEmployeeToDatabase(newEmployee);
            } catch (error) {
                console.error(error);
            }
        };
        
        async addEmployeeToDatabase (newEmployee) {
            try {
                const { first_name, last_name, role, manager } = newEmployee;
        
                const roleResult = await new Promise((resolve, reject) => {
                    connection.query('SELECT r.id AS id FROM role r WHERE title = ?;', [role], (err, res) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            resolve(res[0]);
                        }
                    });
                });
        
                const role_id = roleResult.id;
        
                if (manager === null) {
                    await new Promise((resolve, reject) => {
                        connection.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?);', [first_name, last_name, role_id], (err) => {
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                console.log(`The employee table has been updated to include ${first_name + ' ' + last_name}'s information!`);
                                resolve();
                            }
                        });
                    });
                } else {
                    const managerResult = await new Promise((resolve, reject) => {
                        connection.query('SELECT e.id AS id FROM employee e WHERE first_name = ?;', [manager], (err, res) => {
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                resolve(res[0]);
                            }
                        });
                    });
        
                    const manager_id = managerResult.id;
        
                    await new Promise((resolve, reject) => {
                        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [first_name, last_name, role_id, manager_id], (err) => {
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                console.clear();
                                console.log(this.header);
                                console.log(`The employee table has been updated to include ${first_name + ' ' + last_name}'s information!`);
                                resolve();
                            }
                        });
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };
        
        async updateEmployeeRole () {
            try {
                const employeeList = await new Promise((resolve, reject) => {
                    connection.query('SELECT CONCAT(e.first_name, " ", e.last_name) AS employee_name, e.id FROM employee e;', (err, res) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else if (res.length > 0) {
                            const choices = res.map(({ employee_name }) => employee_name);
                            resolve(choices);
                        } else {
                            resolve([]);
                        }
                    });
                });
        
                if (employeeList.length === 0) {
                    console.log('No employees found to update their roles.');
                    menu();
                    return;
                }
        
                const employeeAnswer = await inquirer.prompt([
                    {
                        name: 'employee',
                        type: 'list',
                        message: 'Whose role would you like to update?',
                        choices: employeeList,
                    },
                ]);
        
                const employee = {
                    first_name: employeeAnswer.employee.split(' ')[0],
                    last_name: employeeAnswer.employee.split(' ')[1],
                };


        
                const roleList = await new Promise((resolve, reject) => {
                    connection.query('SELECT r.title, r.id AS role_id FROM role r;', (err, res) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else if (res.length > 0) {
                            const choices = res.map(({ title, role_id }) => ({ name: title, value: role_id }));
                            resolve(choices);
                        } else {
                            resolve([]);
                        }
                    });
                });
        
                if (roleList.length === 0) {
                    console.log('No roles found to update.');
                    menu();
                    return;
                }
        
                const roleAnswer = await inquirer.prompt([
                    {
                        name: 'role',
                        type: 'list',
                        message: `What is ${employee.first_name}'s new role?`,
                        choices: roleList,
                    },
                ]);
        
                employee.role = roleAnswer.role;
        
                await new Promise((resolve, reject) => {
                    connection.query('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?;', [employee.role, employee.first_name, employee.last_name], (err) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.clear();
                            console.log(this.header);
                            console.log(`The employee table has been updated with ${employee.first_name}'s new role!`);
                            resolve();
                        }
                    });
                });
            } catch (error) {
                console.error(error);
            }
        };
};





module.exports = DatabaseExplorer;