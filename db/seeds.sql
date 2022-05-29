INSERT INTO department (name)
VALUES ("HR"),
        ("Sales"),
        ("Marketing"),
        ("IT");

INSERT INTO role (title, salary, department_id)
    VALUES ('IT manager', 250000, 1),
           ('Payroll', 150000, 1),
           ('Marketing Dirctor', 200000, 1),
           ('HR Manager', 180000, 1),
           ('HR Director', 150000, 1),
           ('IT Director',200000, 1),
           ('Sales Engineer', 190000, 1),
           ('Resptionist',85000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES  ('Lewis, Reggie', 3456, 98),
            ('Reggie, Lewis', 6543, 89);