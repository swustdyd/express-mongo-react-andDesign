/**
 * Created by Aaron on 2018/1/16.
 */
let mongooes = require('mongoose');
let CommentSchema = require('../schemas/comment');
let Comment = mongooes.model('Comment', CommentSchema);

module.exports = Comment;