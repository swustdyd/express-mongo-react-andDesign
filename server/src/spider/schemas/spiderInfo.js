import mongoose from 'mongoose'
const {Schema} = mongoose;
const {Mixed} = Schema.Types;

const SpiderInfoSchema = new mongoose.Schema({
    offset: Number,
    requestCount: Number,
    successCount: Number,
    errorMovies: Mixed,    
    startTime: Date,
    endTime: Date,
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