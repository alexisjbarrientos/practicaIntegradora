import {productsModel} from "../models/products.model.js"

class ProductManager{

getProducts = async () => {
try {
    return await productsModel.find().lean()
} catch (error) {
    console.error("Error al obtener los productos.", error)
}
}

getProductsId = async (id) => {
try {
    return await productsModel.find(id)
} catch (error) {
    console.error("Error al obtener el producto.", error)
}
}

addProducts = async (product) => {
try {
    await  productsModel.create(product)
    return productsModel.findOne({code : product.code})
} catch (error) {
    console.log ( "Error al crear el producto.",error)
}
}

updateProducts = async (id,product) => {
try {
    return await productsModel.findByIdAndUpdate(id,{$set : product})
    
} catch (error) {
    console.log ("Error al actualizar el Producto." ,error)
}
}

deleteProducts = async (id,product) => {
try {
     return await productsModel.findByIdAndDelete (id)
} catch (error) {
    console.log("Error al eliminar el producto.",error)
}}
}

export default ProductManager