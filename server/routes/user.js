/**
 * Created by Aaron on 2018/1/4.
 */
var express = require('express'),
    router = express.Router();
var User = require('../models/user');

//用户注册
router.post('/signup', function (request, response) {
    //request.param('user'),可拿到所有的参数，若在body和query都有user这个参数，routes>query>body
    var _user = request.body.user;
    var user = new User(_user);
    user.save(function (err, user) {
        if(err){
            console.log(err);
            return response.json({success: true, message: '注册失败'});
        }else{
            return response.json({success: true, message: '注册成功'});
        }
    });
});

//用户登录
router.post('/signin', function (request, response) {
    var _user = request.body.user,
        name = _user.name,
        password = _user.password;
    User.findOne({name: name}, function (err, user) {
       if(!user){
           return response.json({success: false, message: '用户名不存在！'});
       }else{
           user.comparePassword(password, function (err, isMatch) {
               if(isMatch){
                   request.session.user = user;
                   request.app.locals.user = user;
                   return response.json({success: true, message: '登录成功'});
               }else{
                   return response.json({success: false, message: '用户名或密码错误！'});
               }
           })
       }
    });
});

//用户登出
router.get('/logout', function (request, response) {
    delete request.session.user;
    delete request.app.locals.user;
    response.redirect('/');
});

module.exports = router;