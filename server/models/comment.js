/**
 * Created by Aaron on 2018/1/16.
 */
var mongooes = require('mongoose');
var CommentSchema = require('../schemas/comment');
var Comment = mongooes.model('Comment', CommentSchema);

module.exports = Comment;