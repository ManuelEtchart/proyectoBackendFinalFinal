import { loggerError, logger } from "../utils/logger.js";
import MongoDB from "../DAOs/DAOMongoDB.js";
import { ADMIN_GMAIL, transporter } from "../utils/nodemailer.js"; 

class ControllerCarrito {
    carritosGET = async (req,res)=>{
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            res.render('carritos', {carritos: await MongoDB.carritos.getAll(), mensajes: await MongoDB.mensajes.getAll(), datosUsuario: req.user})
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    carritoPOST = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            await MongoDB.carritos.save(
                {
                    timestamp: Date.now(),
                    productos: [],
                    direccion: req.user.direccion,
                    email: req.user.email
                }
            );
            res.redirect('/api/carrito')
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    carritoDELETE = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            await MongoDB.carritos.deleteById(req.params.id)
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    carritoGET = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            if(req.params.id === undefined){
                res.render('carritos', {carritos: await MongoDB.carritos.getAll(), mensajes: await MongoDB.mensajes.getAll(), datosUsuario: req.user})
            }else{
                res.render('carrito', {carritos: await MongoDB.carritos.getById(req.params.id), mensajes: await MongoDB.mensajes.getAll(), productos: await MongoDB.productos.getAll(), datosUsuario: req.user})
            }
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    carritoProductoPOST = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            await MongoDB.carritos.agregarProductoEnCarrito(req.params.id, req.params.id_prod)
            res.redirect(req.headers.referer)
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    carritoPedirGET = async (req,res)=>{
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            const carrito = await MongoDB.carritos.getById(req.params.id);
            
            await MongoDB.ordenes.save({
                timestamp: Date.now(),
                productos: carrito[0].productos,
                email: req.user.email,
                estado: 'generada',
                numeroOrden: (await MongoDB.ordenes.getAll()).length + 1 ||  1
            })

            const emailContent = {
                from: 'Ecommerce <noreply@example.com>',
                to: `"ADMIN" <${ADMIN_GMAIL}>`,
                subject: `Nuevo pedido de ${req.user.nombre} ${req.user.apellido} - ${req.user.email}`,
                text: `
                ID Carrito: ${req.params.id}
                Dirección: ${req.user.direccion} 
                Productos Agregados:
                ${JSON.stringify(carrito[0].productos,null,2)}
                `
            }

            try {
                const info = await transporter.sendMail(emailContent);
                logger.info(info);
            } catch (error) {
                loggerError.error(`${error} - Hubo un error en el envío del e-mail de registro`);
            }

            res.render('pedido', {carritos: await MongoDB.carritos.getById(req.params.id), datosUsuario: req.user})
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    carritoProductoDELETE = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            await MongoDB.carritos.borrarProductoEnCarrito(req.params.id,req.params.id_prod)
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }
}

export default ControllerCarrito;