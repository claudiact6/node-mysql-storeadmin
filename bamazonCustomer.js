var mysql = require("mysql");
var inquirer = require("inquirer");
var availableProducts = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "5xADd45hLY1N",
    database: "bamazon"

});

connection.connect(function (err) {
    if (err) throw err;
});

console.log("------Welcome to Bamazon! Here are our available products.------");

connection.query("SELECT item_id, product_name, price FROM products ORDER BY product_name", function(err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
        // console.log("Item " + res[i].item_id + ", " + res[i].product_name + ", $" + res[i].price);
        availableProducts.push(res[i].product_name);
    };
    inquirer.prompt([
        {
            type: "list",
            name: "chosenProduct",
            message: "What product would you like to buy?",
            choices: availableProducts
        },
        {
            type: "input",
            name: "units",
            message: "How many would you like?"
        }
    ]).then(function(answer) {
        var requestedUnits = answer.units;
        var product = answer.chosenProduct;
        connection.query("SELECT stock_quantity, price FROM products WHERE product_name = '" + product + "'", function(err, res) {
            if (err) throw err;
            var unitsInStock = res[0].stock_quantity;
            var price = res[0].price;
            if(unitsInStock > requestedUnits) {
                inquirer.prompt([
                    {
                        type: "list",
                        name: "confirm",
                        message: "Your total is $" + price * requestedUnits + ". Proceed to purchase?",
                        choices: ["Yes", "No"]
                    }
                ]).then(function(answer) {
                    if (answer.confirm === "Yes") {
                        var remaining = unitsInStock - requestedUnits;
                       connection.query("UPDATE products SET stock_quantity = " + remaining + " WHERE product_name = '" + product + "'", function(err, res) {
                            if (err) throw err;
                            console.log("Thank you for your purchase! Visit us again soon.");
                            connection.end();
                        });
                    } else {
                        console.log("Thanks for visiting Bamazon! Please come back soon.")
                        connection.end();
                    } 
                });
            } else {
                console.log("Oops! We don't have enough " + product + "s to fill your order. Thanks for visiting Bamazon!");
                connection.end();
            }
        });
    });

});


