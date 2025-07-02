const { Server } = require("socket.io");
const { saveComment } = require("./controllers/comment");

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "https://event-booking-self.vercel.app",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("new-comment", async (data) => {
            try {
                const comment = await saveComment(data);
                socket.broadcast.emit(`receive-comment:${data.eventId}`, comment);
            } catch (err) {
                console.error("Error in handling new-comment:", err.message);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
}

module.exports = setupSocket;
