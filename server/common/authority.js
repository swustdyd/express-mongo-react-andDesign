/**
 * Created by Aaron on 2018/1/15.
 */

var role = {
    normal: 0,
    admin: 10,
    superAdmin: 50
};

module.exports = {
    requestSignin: function (req, res, next) {
        var user = req.session.user;
        if(!user){
            if(req.xhr){
                res.json({message: '请进行登录', success: false});
            }else{
                res.redirect('/user/signin.html');
            }
        }else{
            next();
        }
    },
    requestAdmin: function (req, res, next) {
        var user = req.session.user;
        if(!user || user.role <= role['admin']){
            if(req.xhr){
                res.json({message: '需要管理员权限', success: false});
            }else{
                res.render('pages/error',{message: '需要管理员权限'});
            }
        }else{
            next();
        }
    }
};