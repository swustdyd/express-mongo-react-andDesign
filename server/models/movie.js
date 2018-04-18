/**
 * Created by Aaron on 2017/12/12.
 */
let mongooes = require('mongoose');
let MoviewSchema = require('../schemas/movie');
let Movie = mongooes.model('Movie', MoviewSchema);

module.exports = Movie;
