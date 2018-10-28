DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (

item_id INT NOT NULL PRIMARY KEY;

product_name VARCHAR(40);

department_name VARCHAR(30);

price FLOAT;

stock_quantity INT;

);

