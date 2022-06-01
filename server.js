const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Atlanta13!',
        database: 'employee_db'
    },
    console.log('connected to the employee_db database. ')
);
db.connect(function (err) {
    if (err) throw err;
    mainMenu();
});


function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do',
            name: 'user',
            choices: [
                'View Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View Department',
                'Add Department',
                'Quit']
        },
    ])
        .then((answers) => {
            if (answers.user === "View Employees") {
                viewEmployees();
            }

            if (answers.user === "Add Employee") {
                addEmployee();
            }

            if (answers.user === "Update Role") {
                updateRole();
            }

            if (answers.user === "View All Roles") {
                viewRole();
            }

            if (answers.user === "Add Role") {
                addRole();
            }

            if (answers.user === "View Department") {
                viewDepartment();
            }

            if (answers.user === "Add Department") {
                addDepartment();
            }

            if (answers.user === "Quit") {
                db.end();
            };
        });

};




viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT (manager.first_name, "", manager.last_name) manager
    FROM employee
    LEFT JOIN role ON employee.role_id=role.id
    LEFT JOIN department ON role.department_id=department.id
    LEFT JOIN employee manager ON employee.manager_id=manager.id`
    db.query(sql, (err, res) => {
        console.table(res)
        if (err) throw err;
        mainMenu();
    });
};

viewDepartment = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
        console.table(res);
        if (err) throw err;
        mainMenu()
    });
};

viewRole = () => {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, res) => {
        console.table(res)
        if (err) throw err;
        mainMenu()
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: "Whats department are you in?",
        }
    ])
        .then(answer => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            db.query(sql, answer.department, (err, res) => {
                if (err) throw err;
            })
            mainMenu()
        })
};

addEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Enter Your First Name',
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Enter Your Last Name',
        },
    ]).then(answer => {
        const queryParams = [answer.firstName, answer.lastName]
        const roleStatment = `SELECT role.id, role.title FROM role`;
        db.query(roleStatment, (err, results) => {
            if (err) throw err;
            mainMenu();
        })
     const roles = results.map(({ id, title }) => ({ name: title, valute: id }))

            inquirer.prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is the role of the Employee?',
                    choices: roles
                }
            ])

                .then(roleChoice => {
                    const role = roleChoice.role;
                    queryParams.push(role);

                    const managerStatement = `SELECT * FROM employee`;

                    db.query(managerStatement, (err, results) => {
                        if (err) throw err;
                        const managers = results.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                        managers.push({ name: "None", value: null });

                        inquirer.prompt
                            ([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Whoe is the employee's manager?",
                                    choices: managers
                                }
                            ])
                            .then(managerChoice => {
                                const manager = managerChoice.manager
                                queryParams.push(manager);
                                const sqlStatement = `INSERT INTO employee (first_name, last_name, role_id, maanger_id)
                        VALUES (?, ?, ?)`;
                                db.query(sqlStatement, queryParams, (err, result) => {
                                    if (err) throw err;
                                    viewEmployees();
                                });
                            });
                    });
                });
            })
    
};


addRole = () => {
    inquirer.prompt([
     {
        type: 'input',
        name: 'role',
        message: "Whats your role?",
    },
     {
        type: 'input',
        name: 'salary',
        message: "Whats the salary of this role?"
    },
     ])
     .then(answer => {
        const queryParams = [answer.role, answer.salary];
        const departmentStatement = `SELECT * FROM department`;
            db.query(departmentStatement, (err, results) => {
            if (err) throw err;
        const department = results.map(({ id, name }) => ({ name: name, value: id, }));
            inquirer.prompt([
         {
            type: 'list',
            name: 'department',
            message: "What department does the role belong to?",
            choices: department
        }
     ])
            .then(departmentChoice => {
            const department = departmentChoice.department;
                queryParams.push(department);

            const sqlStatement = `INSERT INTO role (role, salary, department_id) VALUES (?, ?, ?)`;
            db.query(sqlStatement, queryParams, (err, result) => {
             if (err) throw err;

             viewRole();
            });         
             });
         });
     })
};

updateRole = () => {
    const sql = `SELECT *  FROM employee`;
    db.query(sql, (err, res) => {
        if (err) throw err;
    const employees = results.map(({ first_name, last_name, id }) =>
                    ({ name: `${first_name} ${last_name}`, value: id }));
     inquirer.prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee's role would you like to update?",
            choices: employees
          }
         ])
        .then(employeeChoice => {
            const employee = employeeChoice.employee
            const params = [];
             params.push(employee);
            const sql = `SELECT * FROM role`;
                db.query(sql, (err, res) => {
                if (err) throw err;
            const roles = results.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: "list",
                        name: "role",
                        message: "What is the new role of the Employee?",
                        choices: roles
                  }
                ])
                    .then(roleAnswer => {
                    const role = roleAnswer.role;
                    params.unshift(role);
                    const sql = `UPDATE employees
                                SET role_id = ?
                                WHERE id = ?`
                    db.query(sql, params, (err) => {
                    if (err) { throw err; }
                });                
                    return viewEmployees();                    
            })
          })
        })
    });
}