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
    },
    /**
     * 文件上传工具类
     * @param request request请求
     * @param response
     * @param options 存储的子路径
     * @return {Array} 上传文件数组
     */
    uploadFiles: (request, response, options) => {
        let defaultOptions = {
            subDir: '',
            maxSize: 1000,
            fileFilter: 'any',
            preservePath: ''
        };
        let finalOption = {};
        _.extend(finalOption, defaultOptions, options);
        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `uploads/${finalOption.subDir}`)
            },
            filename: function (req, file, cb) {
                let index = file.originalname.lastIndexOf('.');
                let fileName = file.originalname.substr(0, index);
                let ext = file.originalname.substr(index);
                cb(null, fileName + '-' + Date.now() + ext);
                //cb(null, file.fieldname  + '-' + Date.now());
            }
        });

        let moviePosterUpload = multer({ storage: storage });
        let files = request.files;
        let fileArray = [];
        console.log(request.files);
        logger.info(files);
        if(files){
            files.map(function (item, key) {
                logger.info(item);
                logger.info(key);
            })
        }
        let file = {
            fileName: 'fileName',
            srcName: 'srcName'
        };
        fileArray.push(file);
        return fileArray;
    }
};