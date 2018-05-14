import mongoose from 'mongoose'
const {Schema} = mongoose;
const {Array, String, Mixed} = Schema.Types;

const DoubanMovieSchema = new mongoose.Schema({
    infos: Mixed,
    name: String,
    summary: String,
    mainpic: Mixed
});

export default DoubanMovieSchema;