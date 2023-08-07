const fs= require ('fs')
const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const app = express()
const PORT = 8080

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
//rutas
const productsRouter = require('./routes/products.router')
const cartsRouter = require('./routes/carts.router')

//*********************************************************/
//middlewares para convertir json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "./views")
app.set("view engine", "handlebars")

//*********************************************************/
app.use('/', productsRouter)
app.use('/', cartsRouter)

//*********************************************************/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'))
})

