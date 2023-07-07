import { readFileSync, writeFileSync } from 'fs';

class ProductManager {

  #path

  constructor() {
    this.#path = './src/dao/FileSystem/products.json';
    this.products = [];
  }

  addProduct(title, description, code, price, status, stock, category, thumbnails = []) {  
    const products = this.getProducts();

    //Valida que todos los campos sean obligatorios
    if (!title || !description || !code || !price || !status || !stock || !category) {
      console.log("Todos los campos son obligatorios");
      return;
    }
    //Valida que no se repita el campo code
    if (this.products.some((p) => p.code === code)) {
      console.log("Ya existe un producto con el código " + code);
      return;
    }
    let newId = this.products.length + 1;

    while (this.products.some((p) => p.id === newId)) {
      newId++;
    }

    const product = {
      id: newId,
      title,
      description,
      code,
      price,
      status : true,
      stock, 
      category, 
      thumbnails
    };

    products.push(product);
    this.saveProducts(products);
  }
  getProducts() {
    try {
      const data = readFileSync(this.#path, 'utf8');
      return this.products = JSON.parse(data);
    } catch (error) {
      console.log("Error al leer el archivo de productos", error);
      return [];
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (product) return product;
    return false;
  }

  updateProduct(id, params) {
    const products = this.getProducts();
    const index = products.findIndex( (p) => p.id === id)

    if (index !== -1) {
          const updatedProduct = {...products[index], ... params};
          products[index] = updatedProduct;
          this.saveProducts(products);        }
  }
  deleteProduct(id) {
    const products = this.getProducts();
    const index = products.findIndex( (p) => p.id === id)

    if (index !== -1 ) {
        products.splice(index, 1)[0];
        this.saveProducts(products);
    } else {
      console.log("No existe el producto a eliminar");
    }
  }
  saveProducts(products) {
    try {
      writeFileSync(this.#path, JSON.stringify(products));
    } catch (error) {
      console.log("Error al escribir el archivo de productos", error);
    }
  }
}

export default ProductManager;