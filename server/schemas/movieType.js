import mongoose from 'mongoose'
const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const DoubanTypeSchema = new mongoose.Schema({
    doubanMovieId: String,
    mongoObjectId: {
        type: ObjectId,
        ref: 'DoubanMovie'
    },
    typeKey: String,
    typeValue: String,
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

export default DoubanTypeSchema;