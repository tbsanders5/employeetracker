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
                    "View Employees by Department",
                    "View Employees by Role",
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
                    case "View Employees by Department":
                        deptList();
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
          runProgram;
      });
  };