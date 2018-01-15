/**
 * Created by Aaron on 2018/1/4.
 */
var express = require('express'),
    router = express.Router();
var User = require('../models/user');
var _ = require('underscore');
var Authority = require('../common/authority');


//用户注册
router.post('/signup', function (request, response) {
    //request.param('user'),可拿到所有的参数，若在body和query都有user这个参数，routes>query>body
    var _user = request.body.user;
    var user = new User(_user);
    user.save(function (err, user) {
        if(err){
            throw err;
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
        if(err){
            throw err;
        }
        if(!user){
            return response.json({success: false, message: '用户名不存在！'});
        }else{
            user.comparePassword(password, function (err, isMatch) {
                if(err){
                    throw err;
                }
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

//用户列表
router.get('/list.html', Authority.requestSignin, Authority.requestAdmin, function (request, response) {
    User.fetch(function (err, users) {
        if(err){
            throw err;
        }else {
            response.render('pages/user/list', {
                title: '用户列表页',
                users: users
            });
        }
    })
});

//修改密码
router.post('/updatePwd', function (request, response) {
    var originPwd = request.param('originPwd');
    var newPwd = request.param('newPwd');
    User.findById(request.session.user._id, function (err, currentUser) {
        if(err){
            throw err;
        }else {
            currentUser.comparePassword(originPwd, function (err, isMatch) {
                if(err){
                     throw err;
                }
                if(isMatch){
                    currentUser = _.extend(currentUser, {password: newPwd});
                    currentUser.save(function (err, user) {
                        if(err){
                            throw err;
                            /*console.log(err);
                            response.json({message: '修改密码失败', success: false})*/
                        }else {
                            response.json({message: '修改密码成功', success: true})
                        }
                    })
                }else{
                    response.json({message: '原密码不正确', success: false})
                }
            })
        }
    });
});

//登录页面
router.get('/signin.html', function (request, response) {
    response.render('pages/user/signin', {
        title: '用户登录页'
    });
});
//注册页面
router.get('/signup.html', function (request, response) {
    response.render('pages/user/signup', {
        title: '用户注册页'
    });
});

module.exports = router;