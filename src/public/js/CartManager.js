import { readFileSync, writeFileSync } from 'fs';
import ProductManager from './ProductManager.js';

class CartManager {
    
    #path

    constructor() {
        this.#path = './src/dao/FileSystem/carts.json';
        this.carts = this.getCarts();
        this.products = new ProductManager();
    }

    addCart () {
        
        let newId = this.carts.length + 1;

        while (this.carts.some((c) => c.id === newId)) {
            newId++;
          }

        const cart = {
            id: newId,
            products: []
        }
    
        this.carts.push(cart);

        try {
            writeFileSync(this.#path, JSON.stringify(this.carts));
        } catch (error) {
            console.log("Error al escribir el archivo de carts", error);
        }
    }

    getCarts() {
        try {
          const data = readFileSync(this.#path, 'utf8');
          return this.carts = JSON.parse(data);
        } catch (error) {
          console.log("Error al leer el archivo de productos", error);
          return [];
        }
      }
    
    getCartById(id) {
        const carts = this.getCarts();
        const cart = carts.find(c => c.id === id);
        if (cart) return cart;
        return console.log("Cart no Encontrado");        
    }

    addProductToCart(cid, pid) {
        const carts = this.getCarts();
        try {
            const cartIndex = this.carts.findIndex(c => c.id === cid);
            const productExists = this.products.getProductById(pid);

            if (cartIndex != -1 && productExists) {

                const productIndex = carts[cartIndex].products.findIndex(p => p.id === pid);

                if (productIndex != -1) {
                    carts[cartIndex].products[productIndex].quantity = carts[cartIndex].products[productIndex].quantity + 1;
                } else {

                    const product = {
                        id: pid,
                        quantity: 1
                    }

                    carts[cartIndex].products.push(product);
                }

                writeFileSync(this.#path, JSON.stringify(carts));

                console.log("Producto Agregado correctamente al carrito");

            } else {
                console.log('Pid O Cid inexistentes');
            }

        } catch (error) {
            console.log("Error al agregar el producto al carrito");
        }
    }
}

export default CartManager;