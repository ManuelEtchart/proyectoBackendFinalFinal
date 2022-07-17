import mongoose from "mongoose";

const ordenesSchema = mongoose.Schema({
    timestamp: {type: Date, require: true},
    numeroOrden: {type: Number, require: true},
    estado: {type: String, require: true, default: 'generada'},
    productos: {type: Array, require: true},
    email: {type: String, require: true}
});

const ordenesModel = mongoose.model('ordenes', ordenesSchema);

export default ordenesModel;