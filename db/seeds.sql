INSERT INTO `department` (name)
VALUES ("HR"),
        ("Sales"),
        ("Marketing"),
        ("IT");

INSERT INTO `role` (title, salary, department_id)
    VALUES ('IT manager', 250000, 1),
           ('Payroll', 150000, 1),
           ('Marketing Dirctor', 200000, 1),
           ('HR Manager', 180000, 1),
           ('HR Director', 150000, 1),
           ('IT Director',200000, 1),
           ('Sales Engineer', 190000, 1),
           ('Resptionist',85000, 1),
           ('director of operations',300000, 2),
           ('Assistant Manager', 213000, 2);

INSERT INTO employee (first_name, last_name, title, manager_id)
    VALUES  ('Lewis', 'Reggie','director of operations',  NULL),
            ('Reggie', 'Lewis', 'Assistant Manager', 'Manager')