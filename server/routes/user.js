/**
 * Created by Aaron on 2018/1/4.
 */
const express = require('express'),
    router = express.Router();
const _ = require('underscore');
const path = require('path');
const fs = require('fs');
const Authority = require('../common/authority');
const UserService = require('../service/user');
const logger = require('../common/logger');
const PubFunction = require('../common/publicFunc');
const BusinessException = require('../common/businessException');


/**
 * 用户注册
 */
router.post('/signup', async function (request, response, next) {
    try{
        let _user = request.body.user;
        let resData = await UserService.getUsersByCondition({
            condition: {
                name: _user.name
            }
        });
        if(resData.result && resData.result.length > 0){
            next(new BusinessException('该用户名已存在'));
        }else {
            let resData = await UserService.saveOrUpdateUser(_user);
            if(resData.success){
                resData.result = '';
                resData.message = '注册成功'
            }
            response.json(resData);
        }
    }catch (e){
        next(e);
    }
});

/**
 * 用户登录
 */
router.post('/signin', async function (request, response, next) {
    try{
        let _user = request.body.user,
            name = _user.name,
            password = _user.password,
            sevenDay = request.body.sevenDay;
        let resData = await UserService.getUsersByCondition({
            condition:{
                name: name
            }
        });
        let users = resData.result;
        if(!users || users.length < 1) {
            next(new BusinessException('用户名不存在！'));
        }else{
            let isMatch = await PubFunction.comparePassword(password, users[0].password);
            if(isMatch){
                let user = users[0];
                //过滤敏感信息
                user.password = '';
                if(sevenDay){
                    //七天免登录
                    request.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                }else{
                    //30分钟
                    request.session.cookie.maxAge = 1000 * 60 * 30;
                }
                request.session.user = user;
                request.app.locals.user = user;
                response.json({
                    success: true,
                    message: '登录成功'
                });
            }else{
                next(new BusinessException('用户名或密码错误！'));
            }
        }
    }catch (e){
        next(e);
    }
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
router.get('/getUsers', Authority.requestSignin, Authority.requestAdmin, async function (request, response, next) {
    try {
        let condition = request.query.condition || '{}',
            pageIndex = request.query.pageIndex,
            pageSize = request.query.pageSize;

        condition = JSON.parse(condition);

        let newCondition = {};
        if(condition.searchName){
            newCondition.name = new RegExp(`^${condition.searchName}.*$`, 'i')
        }
        if(condition.searchRole){
            newCondition.role = condition.searchRole;
        }
        if(condition._id){
            newCondition._id = condition._id;
        }
        let resData = await UserService.getUsersByCondition({
            condition: newCondition,
            pageIndex: pageIndex,
            pageSize: pageSize
        });
        response.json(resData);
    }catch (e){
        next(e);
    }
});

/**
 * 修改密码
 */
router.post('/updatePwd', Authority.requestSignin, async function (request, response, next) {
    try {
        let originPwd = request.param('originPwd');
        let newPwd = request.param('newPwd');
        let userId = request.session.user._id;

        let resData = await UserService.getUserById(userId);
        if(!resData.result){
            next(new BusinessException('该用户不存在'));
        }else{
            let isMatch = await PubFunction.comparePassword(originPwd, resData.result.password);
            if(isMatch){
                let user = {
                    _id: userId,
                    password: newPwd
                };
                resData = await UserService.saveOrUpdateUser(user);
                if(resData.success){
                    resData.message = '修改密码成功';
                    //过滤敏感信息
                    resData.result = '';
                }
                response.json(resData);
            }else{
                next(new BusinessException('原密码不正确'));
            }
        }
    }catch (e){
        next(err);
    }
});

/**
 * 检查是否登录
 */
router.get('/checkLogin', function (request, response, next) {
    if(request.session.user){
        response.json({
            success: true,
            result: request.session.user
        })
    }else {
        response.json({success: false})
    }
});

/**
 * 删除用户
 */
router.get('/delete', Authority.requestSignin, Authority.requestSuperAdmin, async function (request, response, next) {
    try {
        let id = request.param('id');
        if(request.session.user._id === id){
            next(new BusinessException('当前用户不能删除'));
        }else{
            let resData = UserService.deleteUserById(id);
            response.json(resData);
        }
    }catch (e){
        next(e);
    }

});

/**
 * 修改用户
 */
router.post('/edit', Authority.requestSignin, async function (request, response, next) {
    try {
        let user = request.body.user;
        let currentUser = request.session.user;
        //检查是否重名
        let resData = UserService.getUsersByCondition({
            condition: {
                _id: {$ne: user._id},
                name: user.name
            }
        });
        if(resData.result && resData.result.length > 0){
            next(new BusinessException('用户名已存在'));
        }else {
            resData = await UserService.getUsersByCondition({
                condition: {
                    _id: user._id
                }
            });

            if(resData.result && resData.result.length > 0){
                let originUser = resData.result[0];
                if(currentUser.role < originUser.role){
                    next(new BusinessException(`您的角色权限低于${user.name}，不能编辑`));
                }else if(currentUser.role < user.role){
                    next(new BusinessException(`您给${user.name}设置的角色权限不能高于您的角色权限`));
                }else {
                    resData = await UserService.saveOrUpdateUser(user);
                    if(resData.success){
                        resData.message = '保存成功';
                        //过滤敏感信息
                        resData.result = '';
                    }
                    response.json(resData);
                }
            }else {
                next(new BusinessException('用户不存在'));
            }
        }
    }catch (e){
        next(e);
    }
});

/**
 * 头像上传
 */
router.post('/uploadIcon', Authority.requestSignin, async (req, res, next) => {
    try{
        let files = await PubFunction.uploadFiles(req, res, {
            subDir: 'user/icon/temp',
            fileFilter: ['.png', '.jpg']
        });
        if(files){
            files.forEach(item => item.url = `uploads/user/icon/temp/${item.filename}`);
            res.json({success: true, message: '头像上传成功', result: files});
        }else{
            next(new BusinessException('上传文件为空'));
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;