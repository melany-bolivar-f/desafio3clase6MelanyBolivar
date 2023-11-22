const fs = require('fs')

class ProductManager {
    constructor(path) {
        this.path = path
        this.start()
    }

    // Verificamos si exite el archivo JSON, si no existe lo creamos.
    start() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([],null,2))
        }
    }

    // Recuperamos los productos del JSON.
    async getProducts() {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(data)
    }

    // Método para agregar un producto.
    async addProduct({ title, description, price, thumbnail, code, stock }) {
        const products = await this.getProducts()
        const id = products.length > 0 ? products[products.length - 1].id + 1 : 1 //id autoincrementable.

        //Comprobamos que ningún campo esté vacío.
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return console.error("Debe completar todos los campos.")
        }
        //Comprobamos que el código (code) no esté repetido.
        if (products.some(product => product.code === code)) {
            return console.error("El código ya existe.")
        }
        //Creamos el objeto incluyendo el id autoincrementable, lo "pusheamos" al array de productos y escribimos el JSON.
        const newProduct = { id, title, description, price, thumbnail, code, stock }
        products.push(newProduct)
        console.log(`El Producto "${newProduct.title}" fue agregado exitosamente.`)
        await fs.promises.writeFile(this.path, JSON.stringify(products,null,2))
    }

    //metdo para hacer el limite deproductos
    async getLimitedProducts(limit) {
        let productsInJson = await fs.promises.readFile("products.json", "utf-8");
        productsInJson = JSON.parse(productsInJson);
    
        if (parseInt(limit) <= 0) {
            console.log("Invalid limit");
        } else {
            return productsInJson.slice(0, parseInt(limit));
        }
    }

    // Método para buscar un producto por id.
    async getProductById(id) {
        const products = await this.getProducts()
        const product = products.find(product => product.id === id) // Mediante el método find buscamos el producto con el id ingresado.
        if (!product) return console.log("Producto no encontrado.")
        return product
    }

    // Método para actualizar un producto ingresando su id y un objeto con el campo o campos actualizados.
    async updateProduct(id, productUpdate) {
        const products = await this.getProducts()
        const productFind = products.findIndex(product => product.id === id) // Mediante el método findIndex buscamos el índice o posición del producto en el array.
        if (productFind === -1) return console.log('No se encuentra el producto.')
        products[productFind] = { ...products[productFind], ...productUpdate, id } // Actualizamos el producto con el índice obtenido y copiamos mediante spread operator los campos del producto original, luego las actualizaciones y por último el id para que el mismo nunca cambie (incluso si se incluye en productUpdate).
        await fs.promises.writeFile(this.path, JSON.stringify(products,null,2))
        console.log('Producto actualizado correctamente.')
    }

    // Método para borrar un producto por su id.
    async deleteProduct(id) {
        const products = await this.getProducts()
        if (!products.some(product => product.id === id)) return console.log('El producto que quiere borrar no existe.') // Mediante el método some comprobamos si el producto existe en el array.
        const productsFiltered = products.filter(product => product.id !== id) // Mediante el método filter creamos un array con todos los productos menos aquel con el id ingresado.
        await fs.promises.writeFile(this.path, JSON.stringify(productsFiltered,null,2))
        console.log('Producto eliminado.')
    }
}


// TESTING
async function test() {

    const instance = new ProductManager('./products.json')

    console.log(await instance.getProducts()) // []

    await instance.addProduct({
        title: "producto prueba1",
        description: "Este es un producto prueba1",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc101",
        stock: 25
    }) // El Producto "producto prueba" fue agregado exitosamente.
    await instance.addProduct({
        title: "producto prueba2",
        description: "Este es un producto prueba2",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc102",
        stock: 25
    })
    await instance.addProduct({
        title: "producto prueba3",
        description: "Este es un producto prueba3",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc103",
        stock: 25
    })
    await instance.addProduct({
        title: "producto prueba4",
        description: "Este es un producto prueba4",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc104",
        stock: 25
    })
    await instance.addProduct({
        title: "producto prueba5",
        description: "Este es un producto prueba5",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc105",
        stock: 25
    })
    await instance.addProduct({
        title: "producto prueba6",
        description: "Este es un producto prueba6",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc106",
        stock: 25
    })
    await instance.addProduct({
        title: "producto prueba7",
        description: "Este es un producto prueba7",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc107",
        stock: 25
    })
    await instance.addProduct({
        title: "producto prueba8",
        description: "Este es un producto prueba8",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc108",
        stock: 25
    })
    await instance.addProduct({
        title: "producto prueba9",
        description: "Este es un producto prueba9",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc109",
        stock: 25
    })
    await instance.addProduct({
        title: "producto prueba10",
        description: "Este es un producto prueba10",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc110",
        stock: 25
    })
    //console.log('Producto recién agregado:', await instance.getProducts()) // Muestra el producto recién agregado.

    //console.log('El producto con id 1 es:', await instance.getProductById(1)) // Muestra el producto con id = 1.

    //console.log(await instance.getProductById(99)) // Producto no encontrado.

    //await instance.updateProduct(1,{stock: 200}) // Producto actualizado correctamente.

    //await instance.deleteProduct(1) // Producto eliminado.

    //await instance.deleteProduct(150) // El producto que quiere borrar no existe.
}

test() // Al finalizar la ejecución products.json quedará con un array vacío [].

module.exports= ProductManager;