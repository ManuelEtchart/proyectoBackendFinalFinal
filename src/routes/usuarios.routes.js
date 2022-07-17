import express from 'express';
import ControllerUsuario from '../controllers/usuarios.controller.js';

const usuarios = express.Router()

usuarios.use(express.json());
usuarios.use(express.urlencoded({extended: true}));


class UsuariosRouter{
    constructor(){
        this.controller = new ControllerUsuario()
    }

    start(){
        usuarios.get('/login', this.controller.usuariosLoginGET);

        usuarios.post('/login', this.controller.usuariosLoginPOST);

        usuarios.get('/registro', this.controller.usuariosRegistroGET);

        usuarios.post('/registro', this.controller.usuariosRegistroPOST);

        usuarios.get('/logout', this.controller.usuariosLogoutGET)

        return usuarios
    }
}

export default UsuariosRouter; 