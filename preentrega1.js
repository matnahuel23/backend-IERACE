class ProductManager{
    constructor(){
        this.products = []
        //autoincrementar, comienza en 1
        this.nextId = 1
    }

    addProduct(product){
        //verifico que sea correcto como se ingreso
        if (!this.isProductValid(product)){
            console.error("Error: El producto no es válido")
            return
        }
        //verifico que no este duplicado
        if(this.isCodeDuplicate(product.code)){
            console.log("Error: El código del producto ya esta siendo utilizado")
            return
        }
        // si todo esta bien se carga el id y luego este se va incrementando a medida que cargue
        product.id= this.nextId++
        // se agrega el producto
        this.products.push(product)
    }

    getProducts(){
        return this.products
    }

    getProductsById(id){
        //con el find busco 1 con el id
        const product = this.products.find((p) => p.id === id)
        if(product){
            return product
        }else{
            console.log("Error: Producto no encontrado")
        }
    }

    isProductValid(product){
        return(
            //verifico que el producto tenga todos los datos cargados correctamente
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock !== undefined
        )
    }

    isCodeDuplicate(code){
        // chequeo con el some si hay alguno con el mismo código devuelve TRUE o FALSE
        return this.products.some((p)=> p.code === code)
    }
}

// creo una instancia de la clase ProductManager
const productManager = new ProductManager()

// agrego productos
productManager.addProduct({
    title: "Producto 1",
    description: "Descripcion Producto 1",
    price: 10,
    thumbnail: "/imgProducto1.jpg",
    code: "C001",
    stock: 5
})

productManager.addProduct({
    title: "Producto 2",
    description: "Descripcion Producto 2",
    price: 20,
    thumbnail: "/imgProducto2.jpg",
    code: "C002",
    stock: 10
})

// Obtener los productos
const productsList = productManager.getProducts()

console.log(productsList)

//Obtener productos por su ID en este caso codeado "1"
const productId = productManager.getProductsById(1)
console.log(productId)

//Obtener producto inexistente con un ID no cargado "7"
const noProduct = productManager.getProductsById(7)