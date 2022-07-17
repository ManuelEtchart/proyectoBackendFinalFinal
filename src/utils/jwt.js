import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config()

const privateKey = process.env.PRIVATEKEY;

export function generateToken(usuario) {
    const token = jwt.sign(usuario, privateKey, {expiresIn: process.env.TIMESESSION})
    return token;
}

export function auth(req, res, next) {
    
    const token = req.cookies.nToken;

    if (!token) {
        return res.render('error-notif', {msg: 'not authenticated'});
    }

    
    jwt.verify(token, privateKey, (err, datos)=>{
        if (err) {
            return res.status(403).json({
                error: 'not authorized'
            });
        }
        req.user = datos;
        next();
    });
}

