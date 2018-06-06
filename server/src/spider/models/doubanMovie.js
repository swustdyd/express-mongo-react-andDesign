import mongooes from 'mongoose'
import DoubanMovieSchema from '../schemas/doubanMovie'

const DoubanMovie = mongooes.model('doubanMovie', DoubanMovieSchema);

export default DoubanMovie;