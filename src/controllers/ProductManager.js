import fs from "fs" //Importamos filesystem

class ProductManager {  //Definir una clase llamada 'ProductManager'
    
    #path //Declara una propedad privada llamada path
    #format //Declara una propiedad privada llamada format

    constructor(path) { //Define el constructor de la clase `ProductManager` y recibe un parámetro llamado `path`
        this.#path = "path" //Asigna el valor del parámetro `path` a la propiedad privada `#path`
        this.#format = "utf-8"//Asigna el valor `"utf-8"` a la propiedad privada `#format`
        this.products = [] //Crea una propiedad pública llamada `products` y la inicializa como un arreglo vacío.
    }

    //Con getProducts leemos y procesamos el json
    getProducts = async () => { //Declara una función llamada `getProducts` que es asíncrona
        try { //Inicia un bloque `try` para manejar 
            //Lee el archivo especificado en la propiedad `#path` con el formato especificado en la propiedad `#format` utilizando el método `readFile`
            return JSON.parse( await fs.promises.readFile(this.#path, this.#format)) //Convierte el contenido del archivo en un objeto JavaScript usando el método `JSON.parse` y lo devuelve
        } catch (error) { //Si ocurre algún error en el bloque `try`, se captura en el bloque `catch'
            console.log('error: Archivo no encontrado')// Y imprime en la consola el mensaje
            return[]
        }
    }
    
    addProduct = async (title, description, price, thumbnail, code, stock) =>{

        const products = await this.getProducts()

        const newProduct = {
            id: await this.#generateId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status: true,
        }

        //Validar Producto

        if (await this.#validateProduct(newProduct)) {
            //Agregar el newProduct al array de products = []
            products.push(newProduct)

            //Con write.file sobreesribe el array de products = [] en el Json
            await fs.promises.writeFile(
                this.#path,
                JSON.stringify(products, null, "\t")
            )
        }


        // Actualizar el array products = [] en el constructor []
        this.products = products

        // Retornar el nuevo producto 
        return newProduct;


    }

    getProductsById = async (id) => {

        const products = await this.getProducts()

        const product = products.find((prod) => prod.id === id)

        return product
    }



    #generateId = async () => {
        
        const products = await this.getProducts()

        return products.length === 0 ? 1 : products[products.length -1].id +1
    }


    #validateProduct = async (product) => {

        const products = await this.getProducts()

        const existingProduct = await products.find(
            prod => prod.code === product.code
        )

        if (existingProduct !== undefined) {
            console.log('El codigo del producto ya existe')
            return false
        }
        return true
    }


    updateProduct = async (id, update) => {
        const products = this.getProducts();
        const index = products.findIndex((prod) => prod.id === id);
        if (index !== -1) {
          const isValid = await this.#validateProduct(update);
          if (!isValid) {
            return console.log("¡Actualización denegada!");
          }
        
          // Crear un nuevo objeto producto actualizado
          products[index] = { ...products[index], ...update };
          // Escribir el array de productos actualizados al archivo
          await fs.promises.writeFile(
            this.#path,
            JSON.stringify(products, null, "\t"),
            this.#format
          );
          // Actualizar el array de productos en la instancia de ProductManager
          this.products = products;
          // Devolver el producto actualizado
          return console.log("Producto Actualizado", products[index]);
        }
        // Si el producto no existe, devolvemos un mensaje
        console.log('Error al actualizar: Producto no encontrado');
      };


   // Eliminamos un producto en especifico buscando con su id
   deleteProduct = async (id) => {
    try {
      // Leer el contenido del archivo
      const products = await this.getProducts();
      // Filtrar el array de productos, excluyendo el producto con el id especificado
      const filterProducts = products.filter((prod) => prod.id !== id);
      // Si se eliminó algún producto, escribir el array de productos actualizado al archivo
      if (products.length !== filterProducts.length) {
        await fs.promises.writeFile(
          this.#path,
          JSON.stringify(filterProducts, null, "\t"),
          this.#format
        );
        // Actualizar el array de productos en la instancia de ProductManager
        this.products = filterProducts;
        // Devolvemos un mensaje que el producto se ha eliminado con exito
        return "Producto eliminado con exito";
      }
      // Si no se eliminó ningún producto, devolvemos un mensaje que no se encontro ese ID
      return "No existe el producto con ese ID";
    } catch (err) {
      console.log(err);
    }
  };


}



export const productManager = new ProductManager("./src/api/products.json");