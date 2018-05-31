/**
 * Created by Aaron on 2017/12/12.
 */
import mongooes from 'mongoose'
import MoviewSchema from '../schemas/movie'

const Movie = mongooes.model('Movie', MoviewSchema);

export default Movie;
