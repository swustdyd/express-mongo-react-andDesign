/**
 * Created by Aaron on 2017/12/15.
 */
let mongooes = require('mongoose');
let UserSchema = require('../schemas/user');
let User = mongooes.model('User', UserSchema);

module.exports = User;