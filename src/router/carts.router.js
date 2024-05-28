import { Router } from 'express'
const routerC = Router()
import CartManager from '../class/cartManagerMd.js'
import ProductManager from '../class/productsManagerMd.js'

const cm = new CartManager()
const pm = new ProductManager()

routerC.get('/', async (req, res) => {
  try {
    const carrito = await cm.getCarts()
    res.json({ carrito })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('Error Interno del Servidor')
  }
})

routerC.get('/:cid', async (req, res) => {
  const { cid } = req.params
  try {
      const cart = await cm.getCartById(cid)
      if (!cart) {
          return res.status(404).json({ error: `Carrito con ID: ${cid} no encontrado` })
      }
      res.render('cart', { cart }) 
  } catch (error) {
      console.error('Error:', error)
      res.status(500).send('Error Interno del Servidor')
  }
})

routerC.post('/', async (req, res) => {
  try {
    const { obj } = req.body

    if (!Array.isArray(obj)) {
      return res.status(400).send('Solicitud no válida: los productos deben ser una array')
    }

    const validProducts = []

    for (const product of obj) {
      const checkId = await pm.getProductsId(product._id)
      if (checkId === null) {
        return res.status(404).send(`Producto con ID ${product._id} no encontrado`)
      }
      validProducts.push(checkId)
    }

    const cart = await cm.addCart(validProducts)
    res.status(200).send(cart)

  } catch (err) {
    console.log(err)
    res.status(500).send('Error Interno del Servidor')
  }
})

routerC.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body

  try {
    const checkIdProduct = await pm.getProductsId(pid)
    if (!checkIdProduct) {
      return res.status(404).send({ message: `Producto con ID: ${pid} no encontrado` })
    }

    const checkIdCart = await cm.getCartById(cid)
    if (!checkIdCart) {
      return res.status(404).send({ message: `Carrito con ID: ${cid} no encontrado` })
    }

    const result = await cm.addProductInCart(cid, { _id: pid, quantity: quantity })
    console.log(result)
    return res.status(200).send({
      message: `Producto con ID: ${pid} agregado al carrito con ID: ${cid}`,
      cart: result,
    })
  } catch (error) {
    console.error('Error occurred:', error)
    return res.status(500).send({ message: 'Se produjo un error al procesar la solicitud.' })
  }
})

routerC.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params
    const { products } = req.body

    for (const product of products) {
      const checkId = await pm.getProductsId(product._id)

      if (!checkId) {
        return res.status(404).send({ status: 'error', message: `El producto ID: ${product._id} no encontrado` })
      }
    }

    const checkIdCart = await cm.getCartById(cid)
    if (!checkIdCart) {
      return res.status(404).send({ status: 'error', message: `El carrito de ID: ${cid} no encontrado` })
    }

    const updatedCart = await cm.updateCart(cid, products)
    res.status(200).send({ status: 'success', cart: updatedCart })
  } catch (error) {
    console.error('Error occurred:', error)
    return res.status(500).send({ status: 'error', message: 'Se produjo un error al procesar la solicitud.' })
  }
})

routerC.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params

    const checkIdProduct = await pm.getProductsId(pid)
    if (!checkIdProduct) {
      return res.status(404).send({ status: 'error', message: `Producto con ID: ${pid} no encontrado` })
    }

    const checkIdCart = await cm.getCartById(cid)
    if (!checkIdCart) {
      return res.status(404).send({ status: 'error', message: `Carrito con ID: ${cid} no encontrado` })
    }

    const findProductIndex = checkIdCart.products.findIndex((product) => product._id.toString() === pid)
    if (findProductIndex === -1) {
      return res.status(404).send({ status: 'error', message: `Producto con ID: ${pid} no encontrado en el carrito` })
    }

    checkIdCart.products.splice(findProductIndex, 1)
    const updatedCart = await cm.deleteProductInCart(cid, checkIdCart.products)

    return res.status(200).send({ status: 'success', message: `Producto eliminado con ID: ${pid}`, cart: updatedCart })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: 'error', message: 'Se produjo un error al procesar la solicitud.' })
  }
})

routerC.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await cm.getCartById(cid)

    if (!cart) {
      return res.status(404).send({ message: `Carrito con ID: ${cid} no encontrado` })
    }

    if (cart.products.length === 0) {
      return res.status(404).send({ message: 'El carrito ya está vacío.' })
    }

    cart.products = []
    await cm.updateOneProduct(cid, cart.products)

    return res.status(200).send({
      status: 'success',
      message: `El carrito con ID: ${cid} se vació correctamente`,
      cart: cart,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: 'Se produjo un error al procesar la solicitud.' })
  }
})

export default routerC
