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
    // runProgram();
  });

//   function runProgram() {

//   }