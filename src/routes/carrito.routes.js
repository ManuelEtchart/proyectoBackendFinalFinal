import express from 'express';
import ControllerCarrito from '../controllers/carrito.controller.js';
import { auth } from '../utils/jwt.js';

const carrito = express.Router()

carrito.use(express.json());
carrito.use(express.urlencoded({extended: true}));

class CarritoRouter{
    constructor(){
        this.controller = new ControllerCarrito()
    }

    start(){
        carrito.get('', auth, this.controller.carritosGET)

        carrito.post('', auth, this.controller.carritoPOST)

        carrito.delete('/:id', auth, this.controller.carritoDELETE);

        carrito.get('/:id?/productos', auth, this.controller.carritoGET)

        carrito.post('/:id/productos/:id_prod', auth, this.controller.carritoProductoPOST)

        carrito.get('/:id/pedir', auth, this.controller.carritoPedirGET)

        carrito.delete('/:id/productos/:id_prod', auth, this.controller.carritoProductoDELETE)

        return carrito
    }
}

export default CarritoRouter;