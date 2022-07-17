import express from 'express';
import ControllerProductos  from '../controllers/productos.controller.js';
import { auth } from '../utils/jwt.js';

const productos = express.Router()

productos.use(express.json());
productos.use(express.urlencoded({extended: true}));

class ProductosRouter {
    constructor(){
        this.controller = new ControllerProductos()
    }

    start(){
        productos.get('/form', auth, this.controller.productosFormGET);

        productos.get('/:id?', auth, this.controller.productosGET);

        productos.post('', auth, this.controller.productosPOST);

        productos.put('/:id', auth, this.controller.productosPUT)

        productos.delete('/:id', auth, this.controller.productosDELETE)

        return productos
    }
}

export default ProductosRouter;