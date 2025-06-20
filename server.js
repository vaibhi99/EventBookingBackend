const express = require("express");
const app = express();
const routes = require("./routes/route");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const http = require("http");

const cors = require("cors");
const setupSocket = require("./socket");
const server = http.createServer(app);


require("dotenv").config();

//initialise port
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// mounting
app.use("/eventbookingweb", routes);

setupSocket(server);    

server.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`)
});

const {dbconnect} = require("./config/database");
dbconnect();

const cloudinaryConnect =require("./config/cloudinary");
cloudinaryConnect();