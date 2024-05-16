import { Router } from "express"
import CartManager from "../class/cartManager.js"
import  __dirname  from '../utils.js'

const routerC = Router()
const cartManager = new CartManager(__dirname + '/dataBase/carrito.json')

routerC.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart()
        res.status(200).json({ message: 'Nuevo carrito creado', cart: newCart })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al crear un nuevo carrito' })
    }
})

routerC.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid)
        const cart = cartManager.getCartById(cartId)
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' })
        }
        res.json(cart)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener el carrito' })
    }
})

routerC.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const quantity = parseInt(req.body.quantity) || 1
        await cartManager.addProductToCart(cid, pid, quantity)
        res.status(200).json({ message: 'Producto agregado al carrito correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al agregar el producto al carrito' })
    }
})

export default routerC