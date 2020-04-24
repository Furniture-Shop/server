// get env CONFIG
require("dotenv").config({
   path: `.env.${process.env.NODE_ENV || "prod"}`,
});

// all module imports
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

// other variables
const app = express();
const { PORT, MONGODB_URL } = process.env;

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan("dev"));

app.use(routes);
app.use(errorHandler);

// Deprecation warning fix
mongoose.set("useCreateIndex", true);

// connection
mongoose
   .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => app.listen(PORT, () => console.log(`http://localhost:${PORT}`)))
   .catch(console.log);
