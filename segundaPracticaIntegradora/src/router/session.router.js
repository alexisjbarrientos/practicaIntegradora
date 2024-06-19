import { Router } from 'express'
import { createHash, isValidPassword } from '../utils.js'
import User from '../models/user.js'
import passport from 'passport'

const routerS = Router()

routerS.post('/register', passport.authenticate('register',{failureRedirect:'failregister'}), async (req,res) =>{
     res.send ({status:"success" , message: "usuario registrado"}) 
})

routerS.get ('/failregister' , async (req,res) => {
    res.send ({ error:"Error al registrar el usuario "})
})

routerS.post('/login',passport.authenticate('login',{failureRedirect: 'faillogin'}) ,async(req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    try {
        const user = req.session.user
        console.log(user)
        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role
        }
        console.log(req.session.user)
        if (user.role ==='admin') {
            return res.redirect('/realTimeProducts')
        }
        else{
            
            res.redirect('/')
        }

    } catch (err) {
        res.status(500).send('Error al iniciar sesión')
    }
})

routerS.get('/faillogin',(req,res) => {
    res.send({error: "Error al iniciar seción"})
})
routerS.get("/github", passport.authenticate("github", { scope: 'user:email' }), async (req, res) => {})

routerS.get("/githubcallback", passport.authenticate("github", { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user
    res.redirect("/")
})

routerS.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login')
    })
})

export default routerS
