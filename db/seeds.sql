INSERT INTO  department (name)
VALUES ("HR"),
        ("Sales"),
        ("Marketing"),
        ("IT"),

INSERT INTO `role` (title, salary, department_id)
    VALUES ('IT manager', 250000, 9876)
           ('Payroll', 150000, 6789)
           ('Marketing Dirctor', 200000, 3456)
           ('HR Manager', 180000, 4321)
           ('HR Director', 150000, 4567)
           ('IT Director',200000, 2567)
           ('Sales Engineer', 190000,6754)
           ('Resptionist',85000, 8765)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES  ('Lewis, Reggie', 3456, 98)
            ('Reggie, Lewis', 6543, 89)