import mongoose from 'mongoose'
const {Schema} = mongoose;
const {Array, String, Mixed, Number} = Schema.Types;

const DoubanMovieSchema = new mongoose.Schema({
    doubanMovieId: String,
    name: String,
    year: Number,
    average: Number,
    mainpic: Mixed,
    summary: String,
    directors: Array,
    writers: Array,
    actors: Array,
    types: Array,
    countries: Array,
    languages: Array,
    pubdates: Array,
    durations: String,
    aka: Array,
    IMBdLink: String,
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