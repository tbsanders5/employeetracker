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
      })
  }