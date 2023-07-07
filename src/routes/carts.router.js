import { Router } from 'express';
//import CartManager from '../public/js/CartManager.js';
import { cartModel } from '../dao/mongo/models/carts.model.js';
import { productModel } from '../dao/mongo/models/products.model.js';

const router = Router();
//const cm = new CartManager();

//Mongoose
router.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find();
        res.json({message: "Success", payload: carts});
    } catch (error) {
        res.status(500).json({error: "Error al buscar los productos en la base de datos: " + error});
    }    
});
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid);
        if (cart) return res.json({message: "Success", payload: cart});
        return res.status(404).json({error: "Cart no encontrado"});
    } catch (error) {
        res.json({error: "Error al buscar el cart: " + error});
    }
});
router.post('/', async (req, res) => {
    try {
        const result = await cartModel.create({});
        res.status(201).json({message: "Success", payload: result});
    } catch (error) {
        res.status(500).json({error: "Error al crear el cart: " + error});        
    }
});
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const product = await productModel.findById(pid);
      const cart = await cartModel.findById(cid);
      if (!cart) return res.status(404).json({ error: "Carrito inexistente" });
      if (!product) return res.status(404).json({ error: "Producto inexistente" });
  
      const result = await cartModel.findOneAndUpdate(
        { _id: cid, "products._id": pid },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );
  
      if (!result) {
        const updatedCart = await cartModel.findByIdAndUpdate(
          cid,
          { $push: { products: { _id: pid, quantity: 1 } } },
          { new: true }
        );
        res.status(200).json({ message: "Producto agregado correctamente", payload: updatedCart });
      } else {
        res.status(200).json({ message: "Producto agregado correctamente", payload: result });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al agregar el producto al carrito: " + error });
    }
  });

//FileSystem
/*router.get('/', async (req, res) => { 
    const carts = await cm.getCarts();
    res.json(carts);
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cm.getCartById(parseInt(cid));
    if (cart) return res.json(cart);
    return res.status(404).json({error: "Cart no encontrado"});
});

router.post('/', (req, res) => {
    cm.addCart();
    res.status(201).json({Message: "Cart Agregado con éxito!"})
});

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    cm.addProductToCart(parseInt(cid), parseInt(pid));
    res.status(201).json({Message: "Producto Agregado al carrito con éxito!"});
});*/

export default router;