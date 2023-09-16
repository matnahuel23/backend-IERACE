const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport')
const { createHash, isValidatePassword } = require('../../utils')

router.post('/register', (req, res, next) => {
    passport.authenticate('register', { failureRedirect: '/failregister' })(req, res, next);
}, async (req, res) => {
    let { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send('Faltan datos.');
    }
    try {
        let user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        };
        res.send({ status: "success", payload: user });
    } catch (error) {
        return res.status(500).send('Error al registrar usuario.');
    }
});

router.get('/failregister', async(req, res) => {
    res.send({error: "Fallo el registro"})
})

router.post('/login', passport.authenticate('login', {failureRedirect:'/faillogin'}), async (req, res) => {
    if(!req.user) return res.status(400).send({status:"error", error:"Credenciales invalidas"})
    req.session.user ={
        first_name : req.user.first_name,
        last_name : req.user.last_name,
        age : req.user.age,
        email : req.user.email
    }
    res.send({status: "success", payload: req.user})
})

router.get('/faillogin', (req, res) => {
    res.send({error: "Falla al loguearse"})
})

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const { first_name, last_name, email, age } = req.session.user;
    console.log(first_name, last_name, email, age)
    res.render('profile', { first_name, last_name, email, age });
    console.log('Usuario logueado con éxito.');
});

router.get('/session', (req, res)=> {
    if(req.session.counter){
        req.session.counter++
        res.send(`Se ha visitado el sitio ${req.session.counter} veces`)
    }
    else{
        req.session.counter = 1
        res.send('¡Bienvenido!')
    }
})

router.get('/logout', (req, res) => {
    // el destroy elimina datos de sesión
    req.session.destroy( err => {
        if(!err) res.send('Logout OK!')
        else res.send({status: 'Logout ERROR', body: err})
    })
})

router.get('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "valores incorrectos" })
    const user = User.findOne({ email: email }, { email: 1, first_name: 1, last_name: 1, password:1 })
    if (!user) return res.status(400).send({ status: "error", error: "usuario no encontrado" })
    if (!isValidatePassword(user, password)) return res.status(403).send({ status: "error", error: "Password incorrecto" })
    delete user.password
    req.session.user = user
    req.session.admin = true
    res.send({ status: "success", payload: user })
});

// Creo middleware de autentificación para permitir seguir como ADMIN
function auth(req, res, next) {
    if(req.session?.user === 'adminCoder@coder.com' && req.session?.admin){
        return next()
    }
    return res.status(401).send('Error de autorización')
}

// Acceso solo del administrador
router.get('/privado', auth, (req, res) => {
    res.send('si estas viendo esto es porque ya te logueaste como administrador')
})

module.exports = router;


