import { loggerError, logger } from "../utils/logger.js";
import MongoDB from "../DAOs/DAOMongoDB.js"; 


class ControllerProductos{
    productosFormGET = async (req,res)=>{
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            res.render('productosForm', {datosUsuario: req.user});
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    productosGET = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            if (req.params.id === undefined) {
                res.render('inicio', {productos: await MongoDB.productos.getAll(), datosUsuario: req.user})
            }else{
                res.render('producto', {producto: await MongoDB.productos.getById(req.params.id), datosUsuario: req.user})
            } 
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    productosPOST = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try{
            await MongoDB.productos.save({
                timestamp: Date.now(),
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                codigo: req.body.codigo,
                foto: req.body.urlFoto,
                precio: req.body.precio,
                stock: req.body.stock
            });

            res.redirect('/')
        }catch(error){
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`);
        }
    }

    productosPUT = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            res.render('error-notif', await MongoDB.productos.updateById(req.params.id, req.query));
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    productosDELETE = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            await MongoDB.productos.deleteById(req.params.id)
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }
}

export default ControllerProductos;