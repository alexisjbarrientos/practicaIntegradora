import passport from "passport"
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import userService from '../models/user.js' 
import {createHash, isValidPassword} from '../utils.js'

const strategy = local.Strategy

const startPassport = () =>{
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23limc4KwD8yfPGwGt",
        clientSecret: "722d6b70e497fbbcfaef0ebeab8a0dcf5f1dd203", 
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    age: profile._json.age, 
                    password: ""
                };
                let result = await userService.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))

passport.use('register',new strategy(
    {passReqToCallback:true,usernameField:'email'},async(req,username,password,done)=>{
        const {first_name,last_name,email,ege} = req.body
        try {
            let user = await userService.findOne({email:username})
            if(user){
                console.log ("el usuario ya existe")
                return done (null,false)
            }
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password:createHash(password)
            }
            let result = await userService.create(newUser)
            return done (null,result)
        } catch (error) {
            return done ("Error al obtener el usuario." + error)
        }
    } 
))

passport.serializeUser((user,done) => {
    done (null, user._id)
})

passport.deserializeUser(async(id,done) =>{
    let user = await userService.findById(id)
    done (null,user)
})

passport.use('login', new strategy({usernameField: 'email'},async (username,password,done) =>{
    try {
        const user = await userService.findOne({email: username})
        if(!user) {
            console.log("El usuario no exite")
            return done (null, user)
        if (!isValidPassword(user ,password))
            return done (null , false)
            return done(null,user)
        }
    } catch (error) {
        return done (error)
    }
}))
}

export default startPassport