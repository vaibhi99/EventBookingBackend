const express = require("express");
const app = express();
const routes = require("./routes/route");

require("dotenv").config();

//initialise port
const PORT = process.env.PORT || 4000;

//middlewares
app.use(express.json());

// mounting
app.use("/eventbookingweb", routes);

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`)
});

const {dbconnect} = require("./config/database");
dbconnect();