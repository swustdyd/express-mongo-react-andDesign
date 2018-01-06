/**
 * Created by Aaron on 2017/12/15.
 */
var mongooes = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongooes.model('User', UserSchema);

module.exports = User;