const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const MongoStore = require('connect-mongo');
const sessionsRouter = require('./routes/sessions');
const viewsRouter = require('./routes/views');
const passport = require('passport')
const initializePassport = require('./config/passport.config')

const app = express();

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://matiasierace:bestoso77@cluster0.132340f.mongodb.net/login?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 6000,
    }),
    secret: 'adminCod3r123',
    // resave en false hace que la sesión muera luego de un tiempo, si quiero que quede activa le pongo true
    resave: false,
    // saveUninitialized en true guarda sesión aun cuando el objeto de sesión no tenga nada por contener
    saveUninitialized: false,
}));
app.use(passport.session())
app.use(passport.initialize())
mongoose.connect('mongodb+srv://matiasierace:bestoso77@cluster0.132340f.mongodb.net/login?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + '/views')
app.set("view engine", "handlebars")

// Rutas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', sessionsRouter)
app.use('/', viewsRouter);
app.get('/', (req, res) => {
    res.render('login.hbs')     
})

initializePassport();

//

app.listen(8080, () => {
    console.log('Servidor en ejecución en el puerto 8080');
});
