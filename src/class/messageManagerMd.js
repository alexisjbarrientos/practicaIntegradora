import {messageModel} from "../models/messages.model.js"

class messageManager{

getMessage = async () => {
try {
    return await messageModel.find().lean()
} catch (error) {
    return error
}
}

addMessage = async (message) => {

 if (message.user === '' || message.message === '') {
    return null
}
try {
   return await  messageModel.create(message)
} catch (error) {
    return error
}
}

deleteMessage = async () => {
try {
    const data = await messageModel.deleteMany({})
    return data
} catch (error) {
    return error
}}
}

export default messageManager