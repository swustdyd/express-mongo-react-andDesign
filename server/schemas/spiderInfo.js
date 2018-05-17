import mongoose from 'mongoose'

const SpiderInfoSchema = new mongoose.Schema({
    tagIndex: Number,
    httpsSuccessCount: Number,
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