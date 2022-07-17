import mongoose from "mongoose";

const mensajesSchema = mongoose.Schema({
    timestamp: {type: Date, require: true, default: Date.now()},
    email: {type: String, require: true},
    mensaje: {type: String, require: true}
});

const mensajesModel = mongoose.model('mensajes', mensajesSchema);

export default mensajesModel;
