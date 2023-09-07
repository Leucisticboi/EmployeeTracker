INSERT INTO department (name) VALUES
    ('Human Resources'),
    ('Sales'),
    ('Marketing'),
    ('Engineering');

INSERT INTO role (title, salary, department_id) VALUES
    ('HR Manager', 70000, 1),
    ('Sales Manager', 90000, 2),
    ('Sales Associate', 50000, 2),
    ('Marketing Director', 75000, 3),
    ('Engineering Director', 90000, 4),
    ('IT Specialist', 65000, 4),
    ('Software Engineer', 85000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, NULL),
    ('Mark', 'Johnson', 3, 2),
    ('Sarah', 'Lee', 4, NULL),
    ('Emily', 'Brown', 7, NULL),
    ('Michael', 'Wilson', 5, 5),
    ('Milo', 'Miller', 6, 5);
    