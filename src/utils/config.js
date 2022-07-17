import dotenv from 'dotenv'
dotenv.config()

const config = {
    mongoDB:{
        url: process.env.MONGODBURL
    }
}

export default config; 