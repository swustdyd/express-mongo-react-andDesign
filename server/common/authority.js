/**
 * Created by Aaron on 2018/1/15.
 */

let role = {
    normal: 0,
    admin: 10,
    superAdmin: 50
};
let errorCode = require('./error').errorCode;

module.exports = {
    requestSignin: function (req, res, next) {
        let user = req.session.user;
        if(!user){
            res.status(500);
            res.json({
                message: '请登录',
                success: false,
                errorCode: errorCode.requestSignin
            });
        }else{
            next();
        }
    },
    requestAdmin: function (req, res, next) {
        let user = req.session.user;
        if(!user || user.role < role['admin']){
            res.status(500);
            res.json({
                message: '需要管理员权限',
                success: false,
                errorCode: errorCode.requestAdmin
            });
        }else{
            next();
        }
    },
    requestSuperAdmin: function (req, res, next) {
        let user = req.session.user;
        if(!user || user.role < role['superAdmin']){
            res.status(500);
            res.json({
                message: '需要超级管理员权限',
                success: false,
                errorCode: errorCode.requestAdmin
            });
        }else{
            next();
        }
    }
};