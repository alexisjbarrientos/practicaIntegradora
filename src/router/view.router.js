import {Router} from 'express'
// import ProductsManager from '../class/productManager.js' se usa para fs
import ProductManager from '../class/productsManagerMd.js'
import  __dirname  from '../utils.js'

const produManager = new ProductManager()
const routerV = Router()

routerV.get("/", async (req, res) => {
    const listProducts = await produManager.getProducts()
    res.render("home",{listProducts})
})

routerV.get("/realtimeproducts", (req,res) =>  {
    res.render("realTimeProducts")
})
routerV.get("/messege", (req,res) =>  {
    res.render("messege")
})


export default routerV