import mongoose from 'mongoose'

const userCollection = "Users"

const userSchema = new mongoose.Schema({
    first_name: String  ,
    last_name: String ,
    email: { type: String, unique: true },
    age: Number,
    role: String ,
    password: String ,
    role: {type: String, enum:['admin','user'], default:'user'}
})

const firstCollection = mongoose.model(userCollection, userSchema)

export default firstCollection
