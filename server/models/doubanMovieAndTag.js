import mongooes from 'mongoose'
import DoubanMovieAndTagSchema from '../schemas/doubanMovieAndTag'

const DoubanMovieAndTag = mongooes.model('DoubanMovieAndTag', DoubanMovieAndTagSchema);

export default DoubanMovieAndTag;