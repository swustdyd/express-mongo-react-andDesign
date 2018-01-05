/**
 * Created by Aaron on 2017/12/12.
 */
var mongooes = require('mongoose');
var MoviewSchema = require('../schemas/movie');
var Movie = mongooes.model('Movie', MoviewSchema);

module.exports = Movie;
