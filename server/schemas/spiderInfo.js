import mongoose from 'mongoose'

const SpiderInfoSchema = new mongoose.Schema({
    offset: Number,
    requestCount: Number,
    successCount: Number,
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

export default SpiderInfoSchema;