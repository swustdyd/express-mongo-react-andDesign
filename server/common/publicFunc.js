/**
 * Created by Aaron on 2018/1/19.
 */

import bcrypt from 'bcrypt'
import Promise from 'promise'
import _ from 'underscore'
import multer from 'multer'
import  fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import BaseConfig from '../../baseConfig'
import { UploadFileType } from './type';

//计算长度，数值越大，破解难度越大
const SALT_WORK_FACTOR = 10;

/**
 * 公共方法，工具类
 */
export default class PublicFunction{
    /**
     * bcrypt加密字符串
     * @param {*} string 需要加密的字符串 
     */
    static bcryptString(string: string) : Promise<string>{
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
     */
    static comparePassword(_password, originPassword) : Promise<boolean> {
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
    }
    
    /**
     * 递归创建目录 同步方法
     * @param {*} dirname 
     */
    static mkdirsSync(dirname: string) : boolean{
        if (fs.existsSync(dirname)) {
            return true;
        } else {
            if (mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }else{
                return false;
            }
        }
    }
    
    /**
     * 文件上传工具类
     * @param request
     * @param response
     * @param options
     */
    static uploadFiles(request, response, options: {subDir?: string, maxSize?: number, fileFilter?: []}) : Promise<UploadFileType[]> {
        const defaultOptions = {
            subDir: '',
            maxSize: 1024 * 1024, //1 MB
            fileFilter: []
        };
        const finalOption = {};
        _.extend(finalOption, defaultOptions, options);
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                const savePath = path.join(BaseConfig.root, `public/uploads/${finalOption.subDir}`);
                //logger.info(`path is '${path}'`);
                if(!fs.existsSync(savePath)){
                    //logger.info('create upload directory');
                    mkdirsSync(savePath);
                }
                cb(null, savePath);
            },
            filename: function (req, file, cb) {
                const index = file.originalname.lastIndexOf('.');
                const fileName = file.originalname.substr(0, index);
                const ext = file.originalname.substr(index);
                cb(null, fileName + '-' + Date.now() + ext);
            }
        });
    
        const upload = multer({
            storage: storage,
            limits: {
                fileSize: finalOption.maxSize
            },
            fileFilter: (req, file, cb) => {
                // 这个函数应该调用 `cb` 用boolean值来
                // 指示是否应接受该文件
    
                // 拒绝这个文件，使用`false`，像这样:
                //cb(null, false)
    
                // 接受这个文件，使用`true`，像这样:
                //cb(null, true)
                //logger.info('start fileFilter');
                const index = file.originalname.lastIndexOf('.');
                const ext = file.originalname.substr(index);
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
    
    /**
     * 剪切图片并进行缩放
     * @param {*} input 图片绝对路径
     * @param {*} output 缩放后存放的绝对路径
     * @param {*} cutArea 剪切区域
     * @param {*} resizeWidth 缩放后的宽度
     * @param {*} resizeHeight 缩放后的高度
     */
    static cutAndResizeImg(input: string, output: string, cutArea: {left: number, right: number, width: number, height: number}, resizeWidth: number, resizeHeight: number) : Promise<boolean>{
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(input);
            const fileData = [];//存储文件流
            stream.on('data', (data) => {
                fileData.push(data);
            });
            stream.on( 'end', function() {
                const finalData = Buffer.concat(fileData);
                sharp(finalData)
                    .extract(cutArea)
                    .resize(resizeWidth || 150, resizeHeight || 150)
                    .toFile(output, (err) => {
                        if(err){
                            reject(err)
                        }
                        resolve({success: true});
                    })
            });
    
        })
    }
    
    /**
     * 剪切图片并缩放至250px
     * @param {*} input 图片绝对路径
     * @param {*} output 缩放后存放的绝对路径
     * @param {*} cutArea 剪切区域
     */
    static cutAndResizeImgTo250px(input: string, output: string, cutArea: {left: number, right: number, width: number, height: number}){
        return this.cutAndResizeImg(input, output, cutArea, 250, 250);
    }
    
    /**
     * 重新构造图片url，加入完整的host
     * @param {*} url 
     */
    static rebuildImgUrl(url: string): string {
        return `${BaseConfig.staticSourceHost}/${url}`;
    }
    
    /**
     * 解析url，不正确的url返回null
     * @param {*} url 
     */
    static parseUrl(url: string) : {url: string, scheme: string, slash: string, host: string, port: string, path: string, query: string, hash: string}{
        const reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        const names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
        const result = reg.exec(url);
        if(result){
            const res = {};
            for(let i = 0; i < names.length;i++){
                res[names[i]] = result[i];
            }
            return res;
        }else {
            return null;
        }
    }
}