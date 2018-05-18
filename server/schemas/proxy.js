import mongoose from 'mongoose'

const ProxySchema = new mongoose.Schema({
    country: String,
    ip: String,
    port: Number,
    protocol: String,
    speed: Number,
    connectTime: Number,
    meta: {
        createAt:{
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

export default ProxySchema;