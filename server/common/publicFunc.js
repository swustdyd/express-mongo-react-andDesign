/**
 * Created by Aaron on 2018/1/19.
 */

var bcrypt = require('bcrypt');
//计算长度，数值越大，破解难度越大
var SALT_WORK_FACTOR = 10;
var logger = require('../common/logger');
var Promise = require('promise');

module.exports = {
    bcryptString: function (string) {
        return new Promise(function (resolve, reject) {
            //获取一个随机salt
            bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                if(err){
                    reject(err);
                }
                //logger.info(salt);
                resolve(salt);
            });
        }).then(function (salt) {
            return new Promise(function (resolve, reject) {
                bcrypt.hash(string, salt, function (err, hash) {
                    if(err){
                        reject(err);
                    }
                    resolve(hash);
                })
            })
        });
    },
    /**
     * 对比用户密码
     * @param _password 用户输入密码
     * @param originPassword 用户存储在系统中的密码
     * @return {*}
     */
    comparePassword: function (_password, originPassword) {
        return new Promise(function (resolve, reject) {
            bcrypt.compare(_password, originPassword, function (err, isMatch) {
                //reject(new Error('就是要出错'));
                if(err){
                    reject(err);
                }else{
                    resolve(isMatch);
                }
            })
        });
    },
    reBuildPromiseException: function (err) {
        logger.error(err);
        var message = err;
        if(err instanceof Error){
            message = err.message
        }
        return message;
    }
};