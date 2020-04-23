/* 
Users Routes (/api/users):
GET / = Get all of the users
POST /signup = Create a new account
POST /login = Login with an account

Carts Routes (/api/carts):
GET /:cid = Get a specific cart
POST / = Create a new cart (Maybe happen in the /api/users/signup)
POST /:cid = Add a new item to a cart
PUT /:cid/iid = Update an item from a cart
DELETE /:cid/:iid = Remove an item from a cart

Items Routes
I can't think of one, maybe some of the routes in the carts routes should be here

Products Routes
GET / = Get all of the products
GET /:pid = Get a specific product
POST / = Create a new product
PUT /:pid = Update a specific product
DELETE /:pid = Delete a specific product
*/

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const customersRoutes = require("./routes/customers-routes");
const cartsRoutes = require("./routes/carts-routes");
const productsRoutes = require("./routes/products-routes");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("combined"));

app.use("/api/users", customersRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/products", productsRoutes);

mongoose
   .connect(
      "mongodb+srv://byter:vzobIuJVgoCgOIYR@cluster0-au5hz.mongodb.net/furniture-shop?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
   )
   .then(() => {
      app.listen(5000);
   })
   .catch((err) => {
      console.log(err);
   });
