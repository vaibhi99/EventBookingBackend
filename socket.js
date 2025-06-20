const { Server } = require("socket.io");
const cors = require("cors");
const {saveComment} = require("./models/comment");


function setupSocket(server){
    const io = new Server(server,{        
        cors:{
            origin:"http://localhost:3000",
            method:["GET","POST"]
        }}
    )

    io.on("connection", (socket) =>{
        console.log("User connected", socket.id);

        socket.on("new-comment", async (data) => {
            try{
                const comment = await saveComment(data);
            } catch(err){
                console.log("Error in saving comments (maybe some data is missing) ");
                console.error(err);
            }

            io.emit(`receive-comment:${data.eventId}`, comment);
        });

        socket.on("disconnect", () =>{
            console.log("User disconnected", socket.id)
        });
    });

    return io;
}

module.exports = setupSocket;