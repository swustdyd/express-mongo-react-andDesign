/**
 * Created by Aaron on 2018/1/16.
 */
import mongoose from 'mongoose'
const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const CommentSchema = new mongoose.Schema({
    movie: {
        type: ObjectId,
        ref: 'Movie'
    },
    from: {
        type: ObjectId,
        ref: 'User'
    },
    to: {
        type: ObjectId,
        ref: 'User'
    },
    replayTo: ObjectId,
    content: String,
    level: Number,
    state: {
        type: Boolean,
        default: true
    },
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

export default CommentSchema;