import { Router } from 'express';
import ProducManager from '../public/js/ProductManager.js';
import { productModel } from '../dao/mongo/models/products.model.js';

const router = new Router();
const pm = new ProducManager();

//Mongoose
router.get('/', async (req, res) => { 
    const { limit } = req.query;
    try {
        if (limit) {
            const limitedProducts = await productModel.find().limit(parseInt(limit)).lean();
            return res.render('home', {limitedProducts});
        } else {
            const products = await productModel.find().lean();
            return res.render('home', {products});
        }
    } catch (error) {
        res.json({ error: "No se puede acceder a los productos desde mongoose: " + error});
    }
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productModel.findById(pid).lean();
        if (product) return res.json({status: "success", payload: product});
        return res.status(404).json({ Error: 'Producto no encontrado' });
    } catch (error) {
        return res.json({error: "Error al buscar el producto: " + error});
    }
})

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        const result = await productModel.create({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        })
        return res.status(201).json({ message: 'Producto Creado', payload: result});
    } catch (error) {
        return res.status(500).json({ error: "Error al crear el producto: " + error});
    }
});

router.put ('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    const newProduct = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };
    try {
        const result = await productModel.updateOne({_id: pid}, newProduct ); 
        return res.status(200).json({ message: 'Producto Actualizado', payload: result});
    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar el producto: " + error});
    }
});

router.delete ('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await productModel.deleteOne({_id: pid});
        return res.status(200).json({ message: 'Producto Eliminado', payload: result});
    } catch (error) {
        return res.status(500).json({ error: "Error al eliminar el producto: " + error});

    }
})

//FileSystem
/*
router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await pm.getProducts();

    if (limit) { 
        const limitedProducts = products.slice(0, parseInt(limit));
        return res.render('home', {limitedProducts})
        //return res.json(limitedProducts);
    }
    return res.render('home', {products});
    //return res.json(products);
});
router.get('/:pid', async (req, res) => { 
    const { pid } = req.params;
    const products = await pm.getProducts();
    const product = products.find(p => p.id === parseInt(pid));

    if(product) return res.json(product);
    return res.status(404).json({ Error: 'Producto no encontrado' });
});
router.post('/', (req, res) => { 
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        pm.addProduct(title, description, code, price, status, stock, category, thumbnails);
        return res.status(201).json({ message: 'Producto agregado' });
    } catch (error) {
        return res.status(500).json({error :"Error al agregar el producto"});
    }
    
});
router.put ('/:pid', (req, res) => {
    const { pid } = req.params;
    try {
        pm.updateProduct(parseInt(pid), req.body);
        return res.status(200).json({ message: 'Producto actualizado' });
    } catch (error) {
        return res.status(500).json({error : "Error al actualizar el producto"});
    }

});
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    try {
        pm.deleteProduct(parseInt(pid));
        return res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        return res.status(500).json({error: "Error al eliminar el producto"});
    }
});*/

export default router;