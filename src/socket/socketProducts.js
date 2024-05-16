import ProductManager from "../class/productsManagerMd.js"
import __dirname from "../utils.js"

const manager = new ProductManager()

const socketProducts =(socketServer) =>{
socketServer.on('connection', async (socket) => {
    console.log("client connected with id",socket.id)
    try {
        const productList = await manager.getProducts()
        socketServer.emit("productView", productList)
    } catch (error) {
        console.error("Error al obtener los productos:", error)
    }

    socket.on('addProduct', async (productData) => {
        try {
            await manager.addProducts(productData)
            const updatedProductList = await manager.getProducts()
            socketServer.emit("productView", updatedProductList)
        } catch (error) {
            console.error("Error al agregar el producto:", error)
        }
    })
    
    socket.on('deleteProduct', async (productId) => {
        try {
            await manager.deleteProducts(productId)
            const updatedProductList = await manager.getProducts()
            socketServer.emit("productView", updatedProductList)
        } catch (error) {
            console.error("Error al eliminar el producto:", error)
        }
    })
    
})}
export default socketProducts