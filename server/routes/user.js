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
const DefaultPageSize = require('../common/commonSetting').queryDefaultOptions.pageSize;


/**
 * 用户注册
 */
router.post('/signup', function (request, response) {
    //request.param('user'),可拿到所有的参数，若在body和query都有user这个参数，routes>query>body
    var _user = request.body.user;
    UserService.getUsersByCondition({condition: {name: _user.name}})
    .then(function (resData) {
        if(resData.result && resData.result.length > 0){
            return Promise.reject({success: false, message: '该用户名已存在'})
        }else {
            return UserService.saveOrUpdateUser(_user).then(function (resData) {
                return response.json({
                    success: true,
                    message: '注册成功'
                });
            })
        }
    }).catch(function (err) {
        logger.error(err);
        return response.json({
            success: false,
            message: err.message
        });
    });
});

/**
 * 用户登录
 */
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

/**
 * 用户登出
 */
router.get('/logout', function (request, response) {
    delete request.session.user;
    delete request.app.locals.user;
    response.json({success: true, message: '登出成功'});
});


/**
 * 获取用户信息
 */
router.get('/getUsers', Authority.requestSignin, Authority.requestAdmin, function (request, response) {
    let condition = request.query.condition || '{}';
    let pageIndex = 0;
    if(/^[0-9]+$/.test(request.query.pageIndex)){
        pageIndex = parseInt(request.query.pageIndex);
    }
    let pageSize = DefaultPageSize;
    if(/^[1-9][0-9]*$/.test(request.query.pageSize)){
        pageSize = Math.min(parseInt(request.query.pageSize), DefaultPageSize);
    }
    condition = JSON.parse(condition);
    UserService.getUsersByCondition({
        condition: condition,
        pageIndex: pageIndex,
        pageSize: pageSize
    }).then(function (resData) {
        response.json(resData);
    }).catch(function (err) {
        response.json({
            success: false,
            message: err.message
        });
    });
});

/**
 * 修改密码
 */
router.post('/updatePwd', Authority.requestSignin, function (request, response) {
    var originPwd = request.param('originPwd');
    var newPwd = request.param('newPwd');
    var userId = request.session.user._id;
    logger.info(userId);
    UserService.getUserById(userId).then(function (resData) {
        logger.info(resData);
        if(!resData.result){
            return Promise.reject({message: '该用户不存在'});
        }else{
            return PubFunction.comparePassword(originPwd, resData.result.password);
        }
    }).then(function (isMatch) {
        if(isMatch){
            var user = {
                _id: userId,
                password: newPwd
            };
            return UserService.saveOrUpdateUser(user).then(function (resData) {
                response.json({
                    message: '修改密码成功',
                    success: true
                });
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

/**
 * 检查是否登录
 */
router.get('/checkLogin', function (request, response) {
    if(request.session.user){
        response.json({success: true, result: {name: request.session.user.name}})
    }else {
        response.json({success: false})
    }
});

/**
 * 删除用户
 */
router.get('/delete', Authority.requestSignin, Authority.requestSuperAdmin, function (request, response) {
    let id = request.param('id');
    if(request.session.user._id === id){
        response.json({success: false, message: '当前用户不能删除'});
    }else{
        UserService.deleteUserById(id).then( resData => {
            response.json(resData)
        }).catch(err => {
            logger.error(err);
            response.json({success: false, message: err.message});
        });
    }
});

/**
 * 修改用户
 */
router.post('/edit', Authority.requestSignin, function (request, response) {
    let user = request.body.user;
    let currentUser = request.session.user;
    UserService.getUsersByCondition({
        condition: {
            _id: {$ne: user._id},
            name: user.name
        }
    }).then(function (resData) {
        if(resData.result && resData.result.length > 0){
            return Promise.reject({ message: '用户名已存在'});
        }else {
            return UserService.getUsersByCondition({
                condition: {
                    _id: user._id
                }
            }).then(function (resData) {
                if(resData.result && resData.result.length > 0){
                    let originUser = resData.result[0];
                    if(currentUser.role < originUser.role){
                        return Promise.reject({ message: `您的角色权限低于${user.name}，不能编辑`});
                    }else if(currentUser.role < user.role){
                        return Promise.reject({ message: `您给${user.name}设置的角色权限不能高于您的角色权限`});
                    }else {
                        return user;
                    }
                }else {
                    return Promise.reject({ success: false, message: '用户不存在'});
                }
            })
        }
    })
    .then(function (user) {
        return UserService.saveOrUpdateUser(user).then(function () {
            response.json({ success: true, message: '保存成功'});
        });
    })
    .catch(function (err) {
        logger.error(err);
        response.json({ success: false, message: err.message});
    });
});

module.exports = router;