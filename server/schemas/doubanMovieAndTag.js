import mongoose from 'mongoose'
const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const DoubanMovieAndTagSchema = new mongoose.Schema({
    doubanMovieId: String,
    mongoObjectId: ObjectId,
    tagIndex: Number,
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

export default DoubanMovieAndTagSchema;