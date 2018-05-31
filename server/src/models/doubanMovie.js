import mongooes from 'mongoose'
import DoubanMovieSchema from '../schemas/doubanMovie'

const DoubanMovie = mongooes.model('DoubanMovie', DoubanMovieSchema);

export default DoubanMovie;
