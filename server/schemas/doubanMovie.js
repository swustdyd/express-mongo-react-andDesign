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
    directors: Mixed,
    writers: Mixed,
    actors: Mixed,
    types: Mixed,
    countries: Mixed,
    languages: Mixed,
    pubdates: Mixed,
    durations: String,
    aka: Mixed,
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