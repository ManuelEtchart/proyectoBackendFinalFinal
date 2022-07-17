import express from 'express';
import path from 'path';
import os from 'os';
import cluster from 'cluster';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config()
//import {createServer} from 'http';
//import {Server} from 'socket.io'
import hbs from 'express-handlebars';
import { logger, loggerError } from './src/utils/logger.js';
import ProductosRouter from './src/routes/productos.routes.js';
import MensajesRouter from './src/routes/mensajes.routes.js';
import CarritoRouter from './src/routes/carrito.routes.js';
import UsuariosRouter from './src/routes/usuarios.routes.js';

const app = express();
app.use(cookieParser())
//const httpServer = new createServer(app);
//export const io = new Server(httpServer);

const MODO_CLUSTER = process.env.MODO === 'cluster';

if(MODO_CLUSTER && cluster.isMaster) {
    const numCPUs = os.cpus().length
    
    logger.info(`PID MASTER ${process.pid}`)

    for(let i=0; i<numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        logger.info('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })

}else{
    app.set('views', path.join(path.dirname(''), 'src/views'));

    app.engine('.hbs', hbs.engine({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        extname: '.hbs',
    }))

    app.set('view engine', '.hbs');

    app.use('/api/chat', (new MensajesRouter()).start());
    app.use('/api/carrito', (new CarritoRouter()).start());
    app.use('/api/productos', (new ProductosRouter()).start());
    app.use('/api/usuarios', (new UsuariosRouter()).start())
    
    /*
    io.on('connection', async (socket) => {
        console.log('Nuevo cliente conectado');

        socket.emit('mensajes', {mensajes: await MongoDB.mensajes.getAll()});

        socket.on('mensajeNuevo', async (mensaje) => {     
            await MongoDB.mensajes.save(mensaje)
            io.sockets.emit('mensajes', {mensajes: await MongoDB.mensajes.getAll()});
        })
    })
    */

    app.get('/', (req,res)=>{
        logger.info(`ruta ${req.url} metodo ${req.method} implementada`)
        res.redirect('api/usuarios/login') 
    });

    app.get('*', (req,res) => {
        res.render('error-notif',{msg: `error: '-2', descripcion: ruta ${req.url} metodo ${req.method} no implementada`});
        logger.warn({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`})
    });
    app.post('*', (req,res) => {
        res.render('error-notif',{msg: `error: '-2', descripcion: ruta ${req.url} metodo ${req.method} no implementada`});
        logger.warn({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`})
    });
    app.delete('*', (req,res) => {
        res.render('error-notif',{msg: `error: '-2', descripcion: ruta ${req.url} metodo ${req.method} no implementada`});
        logger.warn({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`})
    });
    app.put('*', (req,res) => {
        res.render('error-notif', {msg: `error: '-2', descripcion: ruta ${req.url} metodo ${req.method} no implementada`});
        logger.warn({error: '-2', descripcion: `ruta ${req.url} metodo ${req.method} no implementada`})
    });
    
    const PORT = process.env.PORT || 8080;

    const server = app.listen(PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${server.address().port}`);
    });

    server.on("error", error => loggerError.error(error, `Error en servidor ${error}`) ); 
}