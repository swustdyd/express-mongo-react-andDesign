/**
 * Created by Aaron on 2018/1/19.
 */
var User = require('../models/user');
var logger = require('../common/logger');
var Promise = require('promise');
var queryDefaultOptions = require('../common/commonSetting').queryDefaultOptions;
var _ = require('underscore');
var PubFunction = require('../common/publicFunc');

module.exports = {
    /**
     * 根据用户id 获取用户
     * @param id
     * @return {*}
     */
    getUserById: function (id) {
        return new Promise(function (resolve, reject) {
            if(!id){
                reject(new Error("用户id不能为空"));
            }
            User.findOne({_id: id}, function (err, user) {
                if(err){
                    reject(err);
                }
                logger.info(user)
                resolve({success: true, result: user});
            })
        })
    },

    /**
     * 根据查询条件查询用户
     * @param options
     * @return {*}
     */
    getUsersByCondition: function (customOptions) {
        let options = _.extend({}, queryDefaultOptions, customOptions);
        return new Promise(function (resolve, reject) {
            User.count(options.condition, function (err, count) {
                User.find(options.condition)
                    .sort(options.sort)
                    .skip(options.pageIndex * options.pageSize)
                    .limit(options.pageSize)
                    .exec((err, users) => {
                        if(err){
                            reject(err);
                        }
                        resolve({
                            success: true,
                            result: users,
                            total: count,
                            pageIndex: options.pageIndex,
                            pageSize: options.pageSize
                        });
                        resolve({success: true, result: users});
                    })
            });
        });
    },

    /**
     * 保存或者更新用户
     * @param _user 用户信息
     * @return {*}
     */
    saveOrUpdateUser: function (_user) {
        var inputUser = _user;
        var service = this;
        return new Promise(function (resolve, reject) {
            if(inputUser.password){
                return PubFunction.bcryptString(inputUser.password).then(function (bcryptPassword) {
                    inputUser.password = bcryptPassword;
                    resolve(inputUser);
                })
            }else{
                resolve(inputUser);
            }
        }).then(function (inputUser) {
            logger.info(inputUser);
            if(inputUser._id){
                return service.getUserById(inputUser._id).then(function (resData) {
                    var originUser = resData.result;
                    originUser.meta.updateAt = Date.now();
                    _.extend(originUser, inputUser);
                    return originUser;
                });
            }else{
                inputUser = new User(inputUser);
                inputUser.meta.createAt = inputUser.meta.updateAt = Date.now();
                return inputUser;
            }
        }).then(function (inputUser) {
            logger.info(inputUser);
            //inputUser = new User(inputUser);
            //保存用户到数据库
            return new Promise(function(resolve, reject){
                inputUser.save(function (err, user) {
                    if(err){
                        logger.error('保存用户时发生错误');
                        reject(err);
                    }
                    resolve({success: true, result: user});
                });
            });
        });
    },

    deleteUserById: function (id) {
        return new Promise(function (resolve, reject) {
            if(!id){
                reject(new Error('id不能为空'))
            }
            User.remove({_id: id}, function (err, user) {
                if(err){
                    reject(err);
                }
                resolve({success: true, message: '删除成功'});
            })
        });
    }
};