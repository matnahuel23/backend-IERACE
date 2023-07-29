const fs= require ('fs')

const express = require('express')

const app = express()

const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () =>
    console.log(`Server running on port:${PORT}`))

//*********************************************************/
class Contenedor{
    constructor(file){
        this.file = file
    }
    async save(obj){
        try{
            const objects = await this.getAllObjects()
            //Busco el ultimo Id para poder incrementar
            const lastId = objects.length > 0 ? objects[objects.length-1].id : 0
            const newId = lastId + 1
            const newObj = {id: newId, ...obj}
            objects.push(newObj)
            await this.saveObjects(objects)
            return newId
        }catch(error){
            throw new Error('Error al guardar el objeto')
        }
    }
    async getById(id){
        try{
            const objects = await this.getAllObjects()
            const obj = objects.find((o) => o.id === id)
            return obj || null
        }catch(error){
            throw new Error ('Error al obtener el ID')
        }
    }
    async getAll(){
        try{
            const objects = await this.getAllObjects()
            return objects
        }catch(error){
            throw new Error('Error al obtener los objetos')
        }
    }

    async getRandom(){
        try{
            // busco todos los objetos con el metodo getAllObjects
            const objects = await this.getAllObjects()
            // busco un index aleatorio dentro del maximo indice
            const randomIndex = Math.floor(Math.random() * objects.length)
            // retorno un objeto con el indice aleatorio
            return objects[randomIndex]
        } catch (error){
            throw new Error('Error al obtener un objeto aleatorio')
        }
    }
    async deleteById(id){
        try{
            let objects = await this.getAllObjects()
            objects = objects.filter((o)=> o.id !== id)
            await this.saveObjects(objects)
        }catch(error){
            throw new Error('Error al eliminar el objeto')
        }
    }
    async deleteAll(){
        try{
            await this.saveObjects([])
        }catch(error){
            throw new Error('Error al eliminar los objetos')
        }
    }
    async getAllObjects(){
        try{
            const data = await fs.promises.readFile(this.file, 'utf-8')
            return data ? JSON.parse(data): []
        }catch(error){
            return []
        }
    }
    async saveObjects(objects){
        try{
            await fs.promises.writeFile(this.file, JSON.stringify(objects, null, 2))
        }catch(error){
            throw new Error('Error al guardar objetos')
        }
    }
}

//**************************************************************************************/

// hago que el contenedor tome los datos del archivo txt indicandole la ruta
const contenedor = new Contenedor('./productos.txt')

//muestra todos con el GET
app.get("/productos", async (req, res) => {
    try {
        // Obtiene todos los productos usando el método getAll()
        const productos = await contenedor.getAll()
        res.json(productos)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' })
    }
})

// muestra un producto aleatorio usando el nuevo metodo getRandom que comente arriba
app.get("/productosRandom", async (req, res) => {
    try {
        // Obtiene todos los productos usando el método getAll()
        const productos = await contenedor.getRandom()
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' })
    }
})