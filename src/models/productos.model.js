import mongoose from "mongoose";

const productosSchema = mongoose.Schema({
    timestamp: {type: Date, require: true, default: Date.now()},
    nombre: {type: String, require: true},
    descripcion: {type: String, require: true},
    codigo: {type: String, require: true},
    foto: {type: String, require: true},
    precio: {type: Number, require: true},
    stock: {type: Number, require: true}
});

const productosModel = mongoose.model('productos', productosSchema);

export default productosModel;
