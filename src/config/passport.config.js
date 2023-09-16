const passport = require("passport");
const local = require("passport-local");
const userService = require("../models/user");
const { createHash, isValidatePassword } = require("../../utils");

const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userService.findOne({ email: username });
                if (user) {
                    console.log("El usuario ya existe");
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                let result = await userService.create(newUser)
                return done(null, result);
            } catch (error) {
                console.error("Error en el registro:", error);
                return done(error);
            }
        }
    ));
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id);
        done(null, user);
    });
    passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userService.findOne({ email: username });
            if (!user) {
                console.log('El usuario no existe');
                return done(null, false);
            }
            if (!isValidatePassword(user, password)) {
                console.log('Contraseña incorrecta');
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            return done(error);
        }
    }));
}

module.exports = initializePassport;
