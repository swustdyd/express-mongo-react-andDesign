import mongooes from 'mongoose'
import MoviewTypeSchema from '../schemas/movieType'

const MoviewType = mongooes.model('MovieType', MoviewTypeSchema);

export default MoviewType;