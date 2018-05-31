/**
 * Created by Aaron on 2017/12/12.
 */
import mongoose from 'mongoose'

const MovieSchema = new mongoose.Schema({
    doctor: String,
    title: {
        type: String
    },
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: {
        displayName: String,
        filename: String,
        src: String
    },
    year: Number,
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
export default MovieSchema;