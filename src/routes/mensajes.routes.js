import express from 'express';
import ControllerMensajes from '../controllers/mensajes.controller.js';
import { auth } from '../utils/jwt.js';

const mensajes = express.Router();

mensajes.use(express.json());
mensajes.use(express.urlencoded({extended: true}));

class MensajesRouter{
    constructor(){
        this.controller = new ControllerMensajes()
    }

    start(){
        mensajes.post('', auth, this.controller.mensajesPOST);

        mensajes.get('', auth, this.controller.mensajesGET)

        return mensajes
    }
}


export default MensajesRouter;