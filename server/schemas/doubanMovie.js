import mongoose from 'mongoose'
const {Schema} = mongoose;
const {Array, String, Mixed, Number} = Schema.Types;

const DoubanMovieSchema = new mongoose.Schema({
    infos: Mixed,
    name: String,
    summary: String,
    mainpic: Mixed,
    saveIndex: Number,
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

export default DoubanMovieSchema;