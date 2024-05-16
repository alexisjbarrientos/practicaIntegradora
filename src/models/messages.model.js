import mongoose from "mongoose"

const massegeCollection ="massege"
const massegeSchema = new mongoose.Schema({
    
        users : String,
        messege : String,
},{       
        timestamps : true
})

const messegeModel = mongoose.model(massegeCollection,massegeSchema)

export default messegeModel