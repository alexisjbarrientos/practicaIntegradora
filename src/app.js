import express from "express"
import  handlebars from "express-handlebars"
import { Server} from "socket.io"
import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()
console.log(process.env.MONGO_URL)

import __dirname from "./utils.js"

// import ProductManager from "./class/productManager.js" esto lo usamos para fs
import ProductManager from "./class/productsManagerMd.js"
import socketProducts from "./socket/socketProducts.js"
import socketMessege from "./socket/socketmessege.js"
import routerP from "./router/products.router.js"
import routerC from "./router/carts.router.js"
import routerV from "./router/view.router.js"


const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => {
    console.log(`El servidor está funcionando correctamente en el puerto ${PORT}`)
})

mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexion", error))




app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Handlebars

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

//Rutas

app.use('/', routerV)
app.use("/api/products", routerP)
app.use("/api/carts", routerC)

//Socket

const socketServer = new Server(httpServer)

socketProducts(socketServer)
socketMessege(socketServer)