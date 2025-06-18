const express = require("express");
const app = express();
const routes = require("./routes/route");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

require("dotenv").config();

//initialise port
const PORT = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// mounting
app.use("/eventbookingweb", routes);

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`)
});

const {dbconnect} = require("./config/database");
dbconnect();

const cloudinaryConnect =require("./config/cloudinary");
cloudinaryConnect();