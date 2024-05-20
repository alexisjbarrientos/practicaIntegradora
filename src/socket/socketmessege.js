import MessageManager from "../class/messageManagerMd.js"
import __dirname from "../utils.js"

const messageM = new MessageManager()

const socketMessage = (socketServer) =>{
    socketServer.on('connection', async (socket) => {
        console.log("client connected with id",socket.id)

        socket.on ("message", async (infoMessage) =>{
            await messageM.addMessage (infoMessage)
            socketServer.emit("chat", await messageM.getMessage())
        })
    
        socket.on ("newUser",(user)=>{
            socket.broadcast.emit("broadcast",user)
        })
    })
}

export default socketMessage