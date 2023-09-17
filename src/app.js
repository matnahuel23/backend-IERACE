const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require ('path')
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const sessionsRouter = require('./routes/sessions');
const passport = require('passport')
const initializePassport = require('./config/passport.config')
const app = express();
const mongoURL = 'mongodb+srv://matiasierace:bestoso77@cluster0.132340f.mongodb.net/login?retryWrites=true&w=majority'

app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoURL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 6000,
    }),
    secret: 'adminCod3r123',
    // resave en false hace que la sesión muera luego de un tiempo, si quiero que quede activa le pongo true
    resave: false,
    // saveUninitialized en true guarda sesión aun cuando el objeto de sesión no tenga nada por contener
    saveUninitialized: false,
}));
initializePassport();
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Configuración de vistas
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set('views', path.join(__dirname,'views'))

// Rutas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', sessionsRouter)
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.render('login.hbs')     
})
//

app.listen(8080, () => {
    console.log('Servidor en ejecución en el puerto 8080');
});
