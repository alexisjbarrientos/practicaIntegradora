import messegesModel from "../models/messages.model.js"

class messegeManager{

getMessege = async () => {
try {
    return await messegesModel.find().lean
} catch (error) {
    return error
}
}

addMessege = async (messege) => {
    if (messege.messege.trim() === '') {
        return null
    }
try {
   return await  messegesModel.create(messege)
} catch (error) {
    return error
}
}

deleteMessege = async () => {
try {
    const data = await messegesModel.deleteMany({})
    return data
} catch (error) {
    return error
}}
}

export default messegeManager