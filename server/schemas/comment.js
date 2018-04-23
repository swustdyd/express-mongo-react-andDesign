/**
 * Created by Aaron on 2018/1/16.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

let CommentSchema = new mongoose.Schema({
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

module.exports = CommentSchema;