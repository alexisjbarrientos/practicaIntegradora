import { Router } from "express"
// import ProductManager from "../class/productManager.js" esto era para el fs
import ProductManager from "../class/productsManagerMd.js"
import  __dirname  from '../utils.js'

const routerP = Router ()
const productsManager = new ProductManager()

routerP.get('/', async (req, res) => {
    try {
        const products = await productsManager.getProducts()
        if (req.query.limit) {
            const limit = parseInt(req.query.limit)
            products = products.slice(0, limit)
        }
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' })
    }
})

routerP.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)
        const product = await productsManager.getProductsId(productId)
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' })
    }
})

routerP.post('/', async (req , res) => {
    try {
        const productData =  req.body
        await productsManager.addProducts(productData)
        res.status (200).json({message: 'Producto agregado correctamente'})
    } catch (error) {
        console.log(error)
        res.status (500).json ({message: 'Error al agregar el producto'})
    }
})

export default routerP
