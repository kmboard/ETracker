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
                'Update Role',
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
    const sql = `Select * From employee`;
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
            const sql = `INSERT INTO department VALUES (?)`;
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
        const roleStatement = `SELECT * FROM role`;
        db.query(roleStatement, (err, res) => {
            if (err) throw err;
          const role = res.map(({ id, role }) => ({ name: role, value: id}))
            inquirer.prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is the role of the Employee?',
                    choices: role
                }
            ])

                .then(roleChoice => {
                    const role = roleChoice.role;
                    queryParams.push(role);

                    const managerStatement = `SELECT * FROM employee`;

                    db.query(managerStatement, (err, res) => {
                        if (err) throw err;
                        const managers = res.map(({ name, first_name, last_name }) => ({ name: first_name + " " + last_name, value: name }));
                        managers.push({ name: "None", value: null });

                        inquirer.prompt
                            ([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                            .then(managerChoice => {
                                const manager = managerChoice.manager
                                queryParams.push(manager);
                                const sqlStatement = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                                db.query(sqlStatement, queryParams, (err, res) => {
                                    if (err) throw err;
                                    viewEmployees();
                                });
                               return mainMenu();
                            });
                    });
                });
            })
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
            db.query(departmentStatement, (err, res) => {
            if (err) throw err;
        const department = res.map(({ id, name }) => ({ name: name, value: id, }));
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

            const sqlStatement = `INSERT INTO role (role_id, salary, department_id) VALUES (?, ?, ?)`;
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
    const employees = res.map(({ first_name, last_name, id }) =>
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
            const role = res.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: "list",
                        name: "role",
                        message: "What is the new role of the Employee?",
                        choices: role
                  }
                ])
                    .then(roleAnswer => {
                    const role = roleAnswer.role;
                    params.unshift(role);
                    const sql = `UPDATE employee
                                SET role_id = ?
                                WHERE id = ?`
                    db.query(sql, params, (err) => {
                    if (err) { throw err; }
                    viewEmployees(); 
                });                
                 return mainMenu();                    
            })
          })
        })
    });
}
