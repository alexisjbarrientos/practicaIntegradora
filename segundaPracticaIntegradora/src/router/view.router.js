import { Router } from 'express'
import ProductsManager from '../class/productManager.js'
import __dirname from '../utils.js'
import { isAuthenticated, isNotAuthenticated } from '../middleware/authenticated.js';

const produManager = new ProductsManager(__dirname + '/dataBase/Productos.json')
const routerV = Router()

routerV.get("/", async (req, res) => {
    const listProducts = await produManager.getProducts();
    res.render("home", { listProducts })
})

routerV.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts")
})

routerV.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login')
})

routerV.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register')
})


routerV.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
})

export default routerV
