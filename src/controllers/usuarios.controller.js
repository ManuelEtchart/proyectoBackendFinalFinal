import { loggerError, logger } from "../utils/logger.js";
import MongoDB from "../DAOs/DAOMongoDB.js";
import crypto from 'crypto';
import { generateToken } from "../utils/jwt.js";
import { ADMIN_GMAIL, transporter } from "../utils/nodemailer.js";

class ControllerUsuario {
    usuariosRegistroGET = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            res.render('registro')
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    usuariosRegistroPOST = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            const usuarioRegistrado = await MongoDB.usuarios.getByEmail(req.body.email)

            if(usuarioRegistrado){
                res.render('error-notif', {msg: 'Usuario ya registrado'})
            }else{

                const hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
                
                let usuario = {
                    timestamp: Date.now(),
                    email: req.body.email,
                    nombre: req.body.nombreUsuario,
                    apellido: req.body.apellido,
                    telefono: req.body.telefono,
                    password: hash,
                    direccion: req.body.direccion
                }

                await MongoDB.usuarios.save(usuario)

                const token = generateToken(usuario)

                const emailContent = {
                    from: 'Ecommerce <noreply@example.com>',
                    to: `"ADMIN" <${ADMIN_GMAIL}>`,
                    subject: 'Nuevo Ingreso',
                    text: `
                    Nuevo Registro en App Ecommerce
                    E-mail: ${req.body.email},
                    Nombre: ${req.body.nombreUsuario},
                    Apellido: ${req.body.apellido},
                    Teléfono: ${req.body.telefono},
                    Password: ${hash}, 
                    Dirección: ${req.body.direccion}`
                };

                try {
                    const info = await transporter.sendMail(emailContent);
                    logger.info(info);
                } catch (error) {
                    loggerError.error(`${error} - Hubo un error en el envío del e-mail de registro`);
                };
                
                res.cookie('nToken', token, { maxAge: 600000, httpOnly: true }).redirect('/api/usuarios/login')
            }
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    usuariosLoginGET = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            if(req.cookies.nToken){
                res.redirect('/api/productos')
            }else{
               res.render('login') 
            } 
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }
    
    usuariosLoginPOST = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {

            const usuario = await MongoDB.usuarios.getByEmail(req.body.username)

            const pass = crypto.createHash('sha256').update(req.body.password).digest('base64');
            
            if(!(usuario[0].password == pass)){
                logger.info('Contraseña invalida')
                res.render('error-notif', {msg: "Contraseña incorrecta"})
            }else{
                const token = generateToken(usuario[0])
            
                res.cookie('nToken', token, { maxAge: 600000, httpOnly: true }).redirect('/api/productos')
            }         
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }

    usuariosLogoutGET = async (req,res) => {
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        try {
            res.clearCookie('nToken').redirect('/')
        } catch (error) {
            loggerError.error(`${error} - Hubo un error en ruta ${req.url} metodo ${req.method} implementada`)
        }
    }
}

export default ControllerUsuario