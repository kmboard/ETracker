const express = require('express');
const mysql = require ('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: false}));
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

// const inquirer = require('inquirer')

function mainMenu() {
    inquirer.prompt([
        {
        type:'list',
        message: 'What would you like to do',
        name: 'user',
        choices: ['View All Employees', 'Add Employees', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Deparetents', 'Add Departments', 'Quit']
        },
    ])
        .then((answers) => {
            if(answers.user === "View All Employees") {
                viewEmployees();
            }

            if(answers.user === "Add Employee") {
                addEmployee();
            }

            if(answers.user === "Update Employee Role") {
                updateRole();
            }

            if(answers.user === "View All Roles") {
                viewRoles();
            }

            if(answers.user === "Add A Role") {
                addRole();
            }

            if(answers.user === "View Departments") {
                viewDepartments();
            }

            if(answers.user === "Add Department") {
                addDepartment();
            }

            if(answers.user === "Quit") {
                db.end();
            };
        });
};


viewEmployees = () => {
    const sql = `Select employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary CONCAT (manager.first_name, "", manager.last_name) manager
        FROM employee
        LEFT JOIN employee.role.id=role.id
        LEFT JOIN department ON role.department_id=department.id
        LEFT JOIN employee manager ON employee.manager_id=manager.id` 
    db.query(sql, (err, res) => {
        if (err) throw err;
        mainMenu();
    });
};

viewDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        mainMenu()
    });
};

viewRoles = () => {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, res) => {
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
            mainMenu()
        });
    });
};

addEmployee = () => {
    inquirer.prompt([
        {
         type: 'input',
         name: 'employee',
         message: "Whats employee's name?",
        } 
     ]) 
};

addRole = () => {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'role',
            message: "Whats your role?",
        },
        {
            type: 'input',
            name: 'salary',
            message: "Whats the salary of this role?"
        }
    ])
};