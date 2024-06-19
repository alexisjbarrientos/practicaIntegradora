import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv'
import passport from 'passport'

import __dirname from './utils.js'
import ProductManager from './class/productManager.js'
import routerP from './router/products.router.js'
import routerC from './router/carts.router.js'
import routerV from './router/view.router.js'
import routerS from './router/session.router.js'
import startPassport from './middleware/passport.js'

dotenv.config()

const app = express()
const PORT = 8080

const manager = new ProductManager(__dirname + '/database/Productos.json')
const httpServer = app.listen(PORT, () => {
    console.log(`El servidor está funcionando correctamente en el puerto ${PORT}`);
    })
    mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => console.error("Error en la conexion", error))
    

    app.use(session({
        store: MongoStore.create({ 
            mongoUrl: process.env.MONGO_URL}),
            secret: 'secretkey',
            resave: false,
    saveUninitialized: true,
    
}))

startPassport()

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())



// Handlebars

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

// Rutas

app.use('/', routerV)
app.use('/api/products', routerP)
app.use('/api/carts', routerC)
app.use('/api/sessions', routerS)

// Socket
const io = new Server(httpServer)

io.on('connection', async (socket) => {
    console.log("Client connected with id", socket.id)
    try {
        const productList = await manager.readProducts()
        socket.emit("productView", productList)
    } catch (error) {
        console.error("Error al obtener los productos:", error)
    }

    socket.on('addProduct', async (productData) => {
        try {
            await manager.addProduct(productData)
            const updatedProductList = await manager.readProducts()
            socket.emit("productView", updatedProductList);
        } catch (error) {
            console.error("Error al agregar el producto:", error)
        }
    })

    socket.on('deleteProduct', async (productId) => {
        try {
            await manager.deleteProduct(productId)
            const updatedProductList = await manager.readProducts()
            socket.emit("productView", updatedProductList)
        } catch (error) {
            console.error("Error al eliminar el producto:", error)
        }
    })
})

