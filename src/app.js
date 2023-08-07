const fs= require ('fs')
const express = require('express')
const path = require('path')
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

//*********************************************************/
app.use('/', productsRouter)
app.use('/', cartsRouter)
// Rutas
app.use('/api', productsRouter);  // Utilizamos '/api' como prefijo para todas las rutas del enrutador de productos
app.use('/api', cartsRouter);  // Utilizamos '/api' como prefijo para todas las rutas del enrutador de carritos
//*********************************************************/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'))
})

