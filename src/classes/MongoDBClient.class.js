import mongoose from "mongoose";
import config from "../utils/config.js";
import DBClient from "./DBClient.class.js";

const URL = config.mongoDB.url;

class MongoDBClient extends DBClient{
    constructor(){
        super();
        this.connected = false;
        this.client = mongoose;
    }

    async connect(){
        try {

            await this.client.connect(URL);
            this.connected = true;

            console.log('Base de datos conectada');
        } catch (error) {
            throw new Error("Error al conectarse a mongodb");
        }
    }

    async disconnect(){
        try {
            await this.client.disconnect();
            this.connected = false;

            console.log('Base de datos desconectada');
        } catch (error) {
            throw new Error("Error al desconectarse a mongodb");
        }
    }
}

export default MongoDBClient;
