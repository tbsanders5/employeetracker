const mysql = require("mysql");
const express = require("express");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "employee_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    runProgram();
  });

  function runProgram() {
        inquirer
            .prompt({
                name: 'action',
                type: 'list',
                message: 'Choose an option',
                choices: [
                    "View Employees",
                    "View Departments",
                    "View Roles",
                    "Add Employee",
                    "Add Department",
                    "Add Role",
                    "Update Employee Role",
                    "exit"
                ]
            }) 
            .then(function(answer) {
                switch (answer.action) {
                    case "View Employees":
                        empList();
                        break;
                    case "View Departments":
                        deptList();
                        break;
                    case "View Roles":
                        roleList();
                        break;
                    case "Add Employee":
                        addEmployee();
                        break;
                    case "Add Department":
                        addDepartment();
                        break;
                    case "Add Role":
                        addNewRole();
                        break;
                    case "Update Employee Role":
                        updateEmployeesRole();
                        break;    
                    case "exit":
                        connection.end();
                        break;    
                }
            });
  };

  function empList() {
      connection.query(
        "SELECT employees.employees_id, employees.first_name, employees.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles on employees.roles_id = roles.roles_id LEFT JOIN department on roles.department_id = department.department_id LEFT JOIN employees manager on manager.manager_id = employees.manager_id;",
            function(err, res) {
                if (err) throw err;
                    console.table(res);
                    runProgram();

                    return res;
                
            });
  };


  function deptList() {
      connection.query("SELECT * from department", function(err, res) {
          if (err) throw err;
          console.table(res);
          runProgram();
      });
  };

  function roleList() {
      connection.query("SELECT * from roles", function(err, res) {
          if (err) throw err;
          console.table(res);
          runProgram();
      });
  };

  function addEmployeeManager (empId, roleId) {
      connection.query("UPDATE employees SET roles_id = ? WHERE employees_id = ?", [roleId, empId])
  };

  function addEmployee() {
      const questions = [
          {
              type: "input",
              message: "Enter employees first name",
              name: "first_name"   
          },
          {
              type: "input",
              message: "Enter employees last name",
              name: "last_name"
          },
          {
              type: "input",
              message: "Enter employees role ID number",
              name: "titleId"
          },
          {
              type: "input",
              message: "Who is the manager of the employee, enter by ID number",
              name: "managerId"
          }
      ];
      inquirer.prompt(questions).then(function(answer) {
          connection.query(
              "INSERT INTO employees SET ?",
              {
                  first_name: answer.first_name,
                  last_name: answer.last_name,
                  roles_id: answer.titleId,
                  manager_id: answer.managerId
              },
              function(err) {
                  if (err) throw err;
                addEmployeeManager(answer.titleId, answer.managerId);
                empList();
              }
          );
      });
  };

  function addDepartment() {
      inquirer
      .prompt({
          type: "input",
          message: "Enter the name of the new Department",
          name: "department"
      })
      .then(function(answer) {
          console.log(answer.department);
          connection.query("INSERT INTO department SET ?",
          {
              name: answer.department,
          },
          function(err, res) {
              if (err) throw err;
              runProgram();  
          });
      });
  };

  function addNewRole() {
    const questions = [
        {
            type: "input",
            message: "Enter the role you would like to add",
            name: "title"
        },
        {
            type: "input",
            message: "Enter the department this role will be in by ID number",
            name: "id"
        },
        {
            type: "input",
            message: "Enter the employees salary",
            name: "salary"
        }
    ];
    inquirer.prompt(questions).then(function(answer) {
        connection.query(
            "INSERT INTO roles SET ?",
            {
                title: answer.title,
                department_id: answer.id,
                salary: answer.salary
            },
            function(err, res) {
                if(err) throw err;
                runProgram();
            }
        );
    });
};

    function updateEmployeesRole() {
        let importEmployeeArray = [];
        connection.query("SELECT employees_id, concat(first_name, ' ', last_name) AS NAME FROM employee_db.employees", (err, rows) => {
            if(err) throw err;
            rows.forEach((row) => {
                let employeeObject = {
                    name: row.NAME,
                    value: row.id
                }
                importEmployeeArray.push(employeeObject);
            });

            let importRoleArray = [];
            connection.query("SELECT roles.title AS ROLE, roles_id as roles_id FROM employee_db.roles AS roles", (err, rows) => {
                if(err) throw err;
                rows.forEach((row) => {
                    let roleObject = {
                        name: row.ROLE,
                        value: row.roles_id
                    }
                    importRoleArray.push(roleObject)
                });
                inquirer
                .prompt([
                    {
                        type: "list",
                        name: "empList",
                        message: "Choose employee to change role",
                        choices: importEmployeeArray
                    },
                    {
                        type: "list",
                        name: "roles_title",
                        message: "Choose role to assign to employee",
                        choices: importRoleArray
                    }
                ])
                .then(answers => {
                    const empList = answers.empList;
                    const roles_title = answers.roles_title;
                    connection.query(
                        `UPDATE employee_db.employees SET roles_id = "${roles_title}" WHERE employees_id = "${empList}"`,
                        function(err, res) {
                            if (err) throw err;
                            console.log("\n");
                            console.log("Updated Employee")
                            runProgram();

                        });
                })
            });
        });
    }

