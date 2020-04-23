// get env CONFIG
if (process.env.NODE_ENV == "development") {
   require("dotenv").config();
}

// all module imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");

const { errorHandler } = require("./middlewares/errorHandler");

// other variables
const app = express();
const { PORT, MONGODB_URL } = process.env;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(morgan("dev"));

app.use(routes);

app.use(errorHandler);

// connection
mongoose
   .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => app.listen(PORT, () => console.log(`http://localhost:${PORT}`)))
   .catch(console.log);
