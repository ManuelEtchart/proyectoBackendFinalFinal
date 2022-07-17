import mongoose from "mongoose";

const usuariosSchema = mongoose.Schema({
    timestamp: {type: Date, require: true,},
    nombre: {type: String, require: true},
    apellido: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    telefono: {type: Number, require: true},
    direccion: {type: String, require: true}
});

const usuariosModel = mongoose.model('usuarios', usuariosSchema);

export default usuariosModel;