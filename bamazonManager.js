var inquirer = require("inquirer");
var mysql = require("mysql");

var availableProducts = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "5xADd45hLY1N",
    database: "bamazon"
});

connection.connect(function (err, res) {
    if (err) throw err;
});

connection.query("SELECT item_id, product_name, price FROM products WHERE stock_quantity > 0 ORDER BY product_name", function (err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
        // console.log("Item " + res[i].item_id + ", " + res[i].product_name + ", $" + res[i].price);
        availableProducts.push(res[i].product_name);
    };
});

console.log("------Welcome, Bamazon manager!------");

inquirer.prompt([
    {
        type: "list",
        name: "adminOption",
        message: "What would you like to do?",
        choices: ["View products for sale", "View low inventory", "Update inventory (re-count)", "Add new product"]
    }
]).then(function (answer) {
    switch (answer.adminOption) {
        case "View products for sale":
            connection.query("SELECT * FROM products", function (err, res) {
                if (err) throw err;
                console.log(res);
                connection.end();
            });
            break;
        case "View low inventory":
            connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
                if (err) throw err;
                console.log(res);
                connection.end();
            });
            break;
        case "Update inventory (re-count)":
            inquirer.prompt([
                {
                    type: "list",
                    name: "product",
                    message: "Which product's inventory do you want to update?",
                    choices: availableProducts
                },
                {
                    type: "number",
                    name: "units",
                    message: "How many units are in stock?"
                }
            ]).then(function(answer){
                var product = answer.product;
                var units = answer.units;
                connection.query("UPDATE products SET stock_quantity = " + units + " WHERE product_name = '" + product + "'" , function(err, res) {
                    if (err) throw err;
                });
                console.log("Inventory for " + product + " successfully updated!");
                connection.end();
            });
            break;
        case "Add new product":
            inquirer.prompt([
                {
                    type: "number",
                    name: "item_id",
                    message: "Item ID"
                },
                {
                    type: "input",
                    name: "product_name",
                    message: "Product name"
                },
                {
                    type: "input",
                    name: "department_name",
                    message: "Department"
                },
                {
                    type: "number",
                    name: "price",
                    message: "Price"
                },
                {
                    type: "number",
                    name: "stock_quantity",
                    message: "Units in stock"
                },
            ]).then(function (answer) {
                connection.query("INSERT INTO products VALUES ?", )
            });
            break;
    };
});