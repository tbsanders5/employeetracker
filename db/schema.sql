DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    department_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR (100) NOT NULL
);

INSERT INTO TABLE department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

CREATE TABLE roles (
    roles_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR (100) NOT NULL,
    salary DECIMAL (10, 4) NOT NULL,
    department_id INT,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE
);

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Salesperson", 80000, 1);
INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 125000, 3);
INSERT INTO roles (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);
INSERT INTO roles (title, salary, department_id)
VALUES ("Lawyer", 190000, 4);

CREATE TABLE employees(
    employees_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR (100) NOT NULL,
    last_name VARCHAR (100) NOT NULL,
    roles_id INT,
    manager_id INT NULL,
    CONSTRAINT fk_role FOREIGN KEY (roles_id) REFERENCES roles(roles_id) ON DELETE SET NULL,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employees(employees_id) ON DELETE CASCADE
);

INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES ("Dwight", "Shcrute", 1, 1);
INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES ("Stanley", "Hudson", 2, null);
INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES ("Jim", "Halpert", 3, 2);
INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES ("Pam", "Beasley", 4, null);
INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES ("Oscar", "Martinez", 5, null);
INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES ("Angela", "Martin", 6, 3);
INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES ("Ryan", "Howard", 7, null);