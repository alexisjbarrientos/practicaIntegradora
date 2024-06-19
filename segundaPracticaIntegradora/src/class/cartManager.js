
import fs from 'fs/promises'

class CartManager {

    constructor(path) {
        this.path = path
        this.carts = []
        this.loadCarts()
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8')
            this.carts = JSON.parse(data)
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.path, '[]')
                this.carts = []
            } else {
                console.error('Error al cargar los carritos:', error)
            }
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        } catch (error) {
            console.error('Error al guardar los carritos:', error)
        }
    }

    async createCart() {
        const newCart = {
            id: this.addId(),
            products: []
        }
        this.carts.push(newCart)
        await this.saveCarts()
        console.log('Nuevo carrito creado:', newCart)
        return newCart
    }


    getCartById(id) {
        const cart = this.carts.find((c) => c.id === id)
        if (cart) {
            return cart
        } else {
            console.log('Error: Carrito no encontrado.')
            return null
        }
    }

    
    
    
    
    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = this.getCartById(cartId)
        if (cart) {
            const productIndex = cart.products.findIndex((p) => p.id === productId)
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity
            } else {
                cart.products.push({ id: productId, quantity })
            }
            await this.saveCarts()
            console.log('Producto agregado al carrito:', cart.products)
        } else {
            console.log('Error: No se pudo agregar el producto al carrito.')
        }
    }


    addId() {
        const maxId = this.carts.reduce((max, cart) => {
            return cart.id > max ? cart.id : max
        }, 0)
        return maxId + 1
    }

}

export default CartManager
