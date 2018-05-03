/**
 * Created by Aaron on 2018/1/16.
 */
import mongooes from 'mongoose'
import CommentSchema from '../schemas/comment'

const Comment = mongooes.model('Comment', CommentSchema);

export default Comment;