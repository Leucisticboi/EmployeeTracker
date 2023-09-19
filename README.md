# Employee Tracker

## Description

## Directory

[Acceptance Criteria](#acceptance-criteria)

[Installation](#installation)

[Usage](#usage)

[Demonstration](#demonstration)

[License Information](#license-information)

[References](#references)

## Acceptance Criteria
GIVEN a command-line application that accepts user input

WHEN I start the application

THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

WHEN I choose to view all departments

THEN I am presented with a formatted table showing department names and department ids

WHEN I choose to view all roles

THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

WHEN I choose to view all employees

THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

WHEN I choose to add a department

THEN I am prompted to enter the name of the department and that department is added to the database

WHEN I choose to add a role

THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

WHEN I choose to add an employee

THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

WHEN I choose to update an employee role

THEN I am prompted to select an employee to update and their new role and this information is updated in the database

## Installation
Employee Tracker can be cloned to a local repository and run in your CLI with 'npm start' or 'node index.js' commands.

## Usage
Open the application's directory and run 'npm start' or 'node index.js' in the command line. You will then be presented with a menu of options to choose from. 

1. View all departments- Prints a table containing every department stored in the Employee Tracker database.

2. View all roles- Prints a table containing every role stored in the Employee Tracker database.

3. View all employees- Prints a table containing every employee stored in the Employee Tracker databse.

4. Add a department- Prompts the user for the name of a new department they would like to add to the Employee Tracker databse.

5. Add a role- Prompts the user for the name and salary of a new role they would like to add to the Employee Tracker database.

6. Add an employee- Prompts the user for the name, role, and manager name of a new employee they would like to add to the Employee Tracker database.

7. Update an employee role- Prompts the user for the name of an employee, then allows user to change that employee's role within the Employee Tracker database.

## Demonstration
[Video Demonstration](https://drive.google.com/file/d/1GHfKYWtSupl5asnVF4l3pzKzU2XjJ_Gx/view)

## License Information
![MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

[LICENSE](./LICENSE)

## References
I used ChatGPT to come up with some comments for my code.