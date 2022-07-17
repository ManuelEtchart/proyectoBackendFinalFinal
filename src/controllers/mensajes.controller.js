import { loggerError, logger } from "../utils/logger.js";
import MongoDB from "../DAOs/DAOMongoDB.js";
import { io } from "../../server.js"; 

class ControllerMensajes {
    mensajesPOST = async (req,res) =>{
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            
            const mensaje = {
                    email: req.body.email,
                    mensaje: req.body.mensaje
            };
            
            await MongoDB.mensajes.save(mensaje)
            
            res.redirect(req.headers.referer)
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    mensajesGET = async (req,res) =>{
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            res.render('chat', {mensajes: await MongoDB.mensajes.getAll(), datosUsuario: req.user})
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }
}

export default ControllerMensajes;
