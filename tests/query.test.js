const { viewAllDepartments, viewAllRoles, viewAllEmployees, addNewDepartment, getDepartmentNames, addNewRole, getRoleNames, getManagerNames, addNewEmployee } = require('../queries/main-queries');

describe('Queries', () => {
    describe('viewAllDepartments', () => {
        it('Should print a table with all of the information in the department table', () => {
            const departments = [
                {
                    "id": 1,
                    "name": "Human Resources"
                },
                {
                    "id": 2,
                    "name": "Sales"
                },
                {
                    "id": 3,
                    "name": "Marketing"
                },
                {
                    "id": 4,
                    "name": "Engineering"
                }
            ];
            expect(viewAllDepartments().toEqual(departments));
        });
    });
});