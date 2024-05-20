socketClient = io()

const userName = document.getElementById("userName")
const form = document.getElementById("form")
const inputM = document.getElementById("message")
const chat = document.getElementById("chat")


let user

swal.fire({
    title : "Bienvenido al Chat ",
    input : "email",
    inputLabel: "Ingresa tu email",
    inputPlaceholder: "Ingresa tu email",
    inputValidator : (value) =>{
        if (value){
            return !value && "Es necesario ingresar el usuario"
        }
    }
}).then (userN =>{
    user = userN.value
    userName.innerHTML = user
    socketClient.emit("newUser",user)
})



form.onsubmit = (r) =>{
    r.preventDefault()
    const infoMessage = {
        user : user ,
        message : inputM.value
    }
    socketClient.emit("message",infoMessage)
    inputM.value = " "
}


socketClient.on("chat", message => {
    const chatRender = message.map(msg => {
        return `<p><strong>${msg.user}</strong> : ${msg.message}</p>`
    }).join(" ")
    chat.innerHTML = chatRender
})