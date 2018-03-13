/**
 * Created by Aaron on 2018/1/19.
 */

const bcrypt = require('bcrypt');
//计算长度，数值越大，破解难度越大
const SALT_WORK_FACTOR = 10;
const logger = require('../common/logger');
const Promise = require('promise');
const _ = require('underscore');
const multer = require('multer');
const  fs = require('fs');
const path = require('path');

const bcryptString = (string) => {
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
}

/**
 * 对比用户密码
 * @param _password 用户输入密码
 * @param originPassword 用户存储在系统中的密码
 * @return {*}
 */
const comparePassword = (_password, originPassword) => {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(_password, originPassword, function (err, isMatch) {
            //logger.info(`${_password},${originPassword}`);
            if(err){
                reject(err);
            }else{
                resolve(isMatch);
            }
        })
    });
};

//递归创建目录 同步方法
const mkdirsSync = (dirname) => {
    //console.log(dirname);
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
};

/**
 * 文件上传工具类
 * @param request
 * @param response
 * @param options
 * @returns {Promise}
 */
const uploadFiles = (request, response, options) => {
    let defaultOptions = {
        subDir: '',
        maxSize: 1024 * 1024,//1 MB
        fileFilter: []
    };
    let finalOption = {};
    _.extend(finalOption, defaultOptions, options);
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `public/uploads/${finalOption.subDir}`;
            //logger.info(`path is '${path}'`);
            if(!fs.existsSync(path)){
                //logger.info('create upload directory');
                mkdirsSync(path);
             }
            cb(null, path);
        },
        filename: function (req, file, cb) {
            let index = file.originalname.lastIndexOf('.');
            let fileName = file.originalname.substr(0, index);
            let ext = file.originalname.substr(index);
            cb(null, fileName + '-' + Date.now() + ext);
        }
    });

    let upload = multer({
        storage: storage,
        limits: {
            fileSize: finalOption.maxSize
        },
        fileFilter: (req, file, cb) =>{
            // 这个函数应该调用 `cb` 用boolean值来
            // 指示是否应接受该文件

            // 拒绝这个文件，使用`false`，像这样:
            //cb(null, false)

            // 接受这个文件，使用`true`，像这样:
            //cb(null, true)
            //logger.info('start fileFilter');
            let index = file.originalname.lastIndexOf('.');
            let ext = file.originalname.substr(index);
            if(finalOption.fileFilter && finalOption.fileFilter.length > 0){
                let extValidate = false;
                finalOption.fileFilter.forEach(function (item, index) {
                    if(item.toLowerCase() === ext.toLowerCase()){
                        extValidate = true;
                        return false;
                    }
                });
                if(extValidate){
                    cb(null, true);
                }else{
                    cb(new Error(`不支持文件格式：${ext}`));
                }
            }else {
                cb(null, true);
            }

            // 如果有问题，你可以总是这样发送一个错误:
            //cb(new Error('I don\'t have a clue!'))
        }
    }).any();
    return new Promise(function (resolve, reject) {
        upload(request, response, function (err) {
            if (err) {
                // 发生错误
                reject(err);
            }
            // 一切都好
            resolve(request.files);
        })
    });
}
module.exports = {
    bcryptString: bcryptString,
    comparePassword: comparePassword,
    mkdirsSync: mkdirsSync,
    uploadFiles: uploadFiles
};