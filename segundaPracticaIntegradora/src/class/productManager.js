import fs from 'fs/promises'

class ProductManager {
    constructor(path) {
        (this.path = path),
        (this.products = [])
    }

    async addProduct(product) {
        try {
            // Validar campos
            if (!this.validateFields(product)) {
                throw new Error("Todos los campos son obligatorios" + error.message)
            }
            // validar producto existente
            const existingProduct = this.products.find(p => p.code === product.code)
            if (existingProduct) {
                return
            }
                           
            const products_id = this.products.length + 1
            const newProduct = {
                id: products_id,
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock
            };
            this.products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2))
        } catch (error) {
            throw new Error("Error al ingresar productos: " + error.message)
        }
    }

    validateFields(product) {
        return (
            product.title &&
            product.description !== "" &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock !== undefined
        )
    }

    async readProducts() {
        const data = await fs.readFile(this.path, 'utf8')
        return JSON.parse(data)
    }

    async getProducts() {
        try {
            const data2 = await this.readProducts()
            return data2;
        } catch (error) {
            console.error("Error al obtener los productos", error)
        }
    }

    async getProductById(id) {
        try {
            const data3 = await this.readProducts();
            const getId = data3.find(product => product.id === id)
            return getId;
        } catch (error) {
            console.error("Error al obtener el producto ", error)
        }
    }

    async updateProduct(id, ...product) {
        try {
            await this.deleteProduct(id);
            const data4 = await this.readProducts()
            const addProduct = [{ ...product, id }, ...data4]
            await fs.writeFile(this.path, JSON.stringify(addProduct, null, 2))
        } catch (error) {
            console.error("Error al actualizar el producto", error)
        }
    }

    async deleteProduct(id) {
        try {
            const data5 = await this.readProducts()
            const removedProduct = data5.filter(product => product.id !== id)
            await fs.writeFile(this.path, JSON.stringify(removedProduct, null, 2))
        } catch (error) {
            console.error("No se pudo eliminar el producto", error)
        }
    }
}

export default ProductManager
