/**
 * Created by Aaron on 2017/12/15.
 */
var mongooes = require('mongoose');
var UserSchema = require('../schemas/movie');
var User = mongooes.model('Movie', UserSchema);

module.exports = User;