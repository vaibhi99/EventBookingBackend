const express = require("express");
const app = express();

require("dotenv").config();

//initialise port
const PORT = process.env.PORT || 4000;

//middlewares
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`)
});

const {dbconnect} = require("./config/database");
dbconnect();