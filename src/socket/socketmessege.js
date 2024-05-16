import MessegeManager from "../class/messegeManagerMd.js"
import __dirname from "../utils.js"

const messegeM = new MessegeManager()

const socketMessege = (socketServer) =>{
    socketServer.on('connection', async (socket) => {
        console.log("client connected with id",socket.id)})
}

export default socketMessege