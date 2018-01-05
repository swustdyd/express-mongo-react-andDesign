/**
 * Created by Aaron on 2018/1/4.
 */
var express = require('express'),
    router = express.Router();
var User = require('../models/user');
//signup
router.post('/user/signup', function (request, response) {
    var _user = request.body.user;
    var user = new User(_user);
    user.save(function (err, user) {
        if(err){
            console.log(err);
        }
        response.redirect('/');
    })
});

module.exports = router;