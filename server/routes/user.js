/**
 * Created by Aaron on 2018/1/4.
 */
var express = require('express'),
    router = express.Router();
var User = require('../models/user');
var _ = require('underscore');
var Authority = require('../common/authority');
var UserService = require('../service/user');
var logger = require('../common/logger');
var PubFunction = require('../common/publicFunc');


//用户注册
router.post('/signup', function (request, response) {
    //request.param('user'),可拿到所有的参数，若在body和query都有user这个参数，routes>query>body
    var _user = request.body.user;
    UserService.saveOrUpdateUser(_user).then(function (result) {
        logger.info(result);
        var message;
        if(result.success){
            message = '注册成功';
        }else{
            message = result.message || '注册失败';
        }
        return response.json({
            success: true,
            message: message
        });
    }).catch(function (err) {
        logger.error(err);
        return response.json({
            success: false,
            message: err.message
        });
        //throw err;
    });
});

//用户登录
router.post('/signin', function (request, response) {
    //logger.info(request.sessionID);
    let _user = request.body.user,
        name = _user.name,
        password = _user.password;
    UserService.getUsersByCondition({
        condition:{
            name: name
        }
    }).then(function (resData) {
        let users = resData.result;
        if(!users || users.length < 1) {
            return Promise.reject({success: false, message: '用户名不存在！'});
        }else{
            return PubFunction.comparePassword(password, users[0].password).then(function (isMatch) {
                if(isMatch){
                    let user = users[0];
                    user.password = '';
                    request.session.user = user;
                    request.app.locals.user = user;
                    //logger.info("用户名：" + request.app.locals.user.name);
                    return response.json({
                        success: true,
                        message: '登录成功'
                    });
                }else{
                    return Promise.reject({
                        success: false,
                        message: '用户名或密码错误！'
                    });
                }
            });
        }
    }).catch(function (err) {
        logger.error(err);
        return response.json({
            success: false,
            message: err.message
        });
    });
});

//用户登出
router.get('/logout', function (request, response) {
    delete request.session.user;
    delete request.app.locals.user;
    response.json({success: true, message: '登出成功'});
});


//获取用户信息
router.get('/getUsers', Authority.requestSignin, Authority.requestAdmin, function (request, response) {
    UserService.getUsersByCondition().then(function (resData) {
        response.json(resData);
    }).catch(function (err) {
        response.json({
            success: false,
            message: err.message
        });
    });
});

//修改密码
router.post('/updatePwd', function (request, response) {
    var originPwd = request.param('originPwd');
    var newPwd = request.param('newPwd');
    var userId = request.session.user._id;
    UserService.getUserById(userId).then(function (user) {
        if(!user){
            return Promise.reject({message: '该用户不存在'});
        }else{
            return PubFunction.comparePassword(originPwd, user.password);
        }
    }).then(function (isMatch) {
        if(isMatch){
            var user = {
                _id: userId,
                password: newPwd
            };
            return UserService.saveOrUpdateUser(user).then(function (data) {
                if(!data.success){
                    return Promise.reject(data.message);
                }else{
                    response.json({
                        message: '修改密码成功',
                        success: data.success
                    });
                }
            });
        }else{
            return Promise.reject({
                success: false,
                message: '原密码不正确'
            });
        }
    }).catch(function (err) {
        logger.error(err);
        return response.json({
            success: false,
            message: err.message
        });
    });
});

router.get('/checkLogin', function (request, response) {
    if(request.session.user){
        response.json({success: true, result: {name: request.session.user.name}})
    }else {
        response.json({success: false})
    }
});

module.exports = router;