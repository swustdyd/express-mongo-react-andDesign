/*
 * @Author: yedong.deng 
 * @Date: 2018-05-10 17:24:27 
 * @Last Modified by:   aaron.deng 
 * @Last Modified time: 2018-05-10 17:24:27 
 */
import UserService from '../service/user'
import PubFunction from '../common/publicFunc'
import BusinessException from '../common/businessException'
import BaseController from './baseController';

export default class UserController extends BaseController{
    constructor(){
        super();
        this.userService = new UserService();
    }

    /**
     * 用户注册
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async signup(request, response, next){
        try{
            const {user: _user} = request.body;
            let resData = await this.userService.getUsersByCondition({
                condition: {
                    name: _user.name
                }
            });
            if(resData.result && resData.result.length > 0){
                next(new BusinessException('该用户名已存在'));
            }else {
                resData = await this.userService.saveOrUpdateUser(_user);
                if(resData.success){
                    resData.result = '';
                    resData.message = '注册成功'
                }
                response.json(resData);
            }
        }catch (e){
            next(e);
        }
    }

    /**
     * 用户登录
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async signin(request, response, next){
        try{
            const {user: _user, sevenDay} = request.body;
            const {name, password} = _user;
            const resData = await this.userService.getUsersByCondition({
                condition:{
                    name: name
                }
            });
            const users = resData.result;
            if(!users || users.length < 1) {
                next(new BusinessException('用户名不存在！'));
            }else{
                const isMatch = await PubFunction.comparePassword(password, users[0].password);
                if(isMatch){
                    const user = users[0];
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
                    response.cookie('extra', { a: 1, b: 2, c: 3}, { maxAge: 30 * 60 * 1000});
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
    }

    /**
     * 用户登出
     * @param {*} request 
     * @param {*} response 
     */
    logout(request, response) {
        delete request.session.user;
        delete request.app.locals.user;
        response.json({success: true, message: '登出成功'});
    }

    /**
     * 获取用户信息
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async getUsers(request, response, next) {
        try {
            const {pageIndex, pageSize} = request.query;
            let condition = request.query.condition || '{}';
            condition = JSON.parse(condition);

            const newCondition = {};
            if(condition.searchName){
                newCondition.name = new RegExp(`^${condition.searchName}.*$`, 'i')
            }
            if(condition.searchRole){
                newCondition.role = condition.searchRole;
            }
            if(condition._id){
                newCondition._id = condition._id;
            }
            const resData = await this.userService.getUsersByCondition({
                condition: newCondition,
                pageIndex: pageIndex,
                pageSize: pageSize
            });
            response.json(resData);
        }catch (e){
            next(e);
        }
    }

    /**
     * 修改密码
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async updatePwd(request, response, next) {
        try {
            const {originPwd, newPwd} = request.body;
            const userId = request.session.user._id;

            let resData = await this.userService.getUserById(userId);
            if(!resData.result){
                next(new BusinessException('该用户不存在'));
            }else{
                const isMatch = await PubFunction.comparePassword(originPwd, resData.result.password);
                if(isMatch){
                    const user = {
                        _id: userId,
                        password: newPwd
                    };
                    resData = await this.userService.saveOrUpdateUser(user);
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
    }

    /**
     * 检查是否登录
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    checkLogin(request, response, next) {
        if(request.session.user){
            response.json({
                success: true,
                result: request.session.user
            })
        }else {
            response.json({success: false})
        }
    }

    /**
     * 删除用户
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async delete(request, response, next) {
        try {
            const id = request.param('id');
            if(request.session.user._id === id){
                next(new BusinessException('当前用户不能删除'));
            }else{
                const resData = await this.userService.deleteUserById(id);
                response.json(resData);
            }
        }catch (e){
            next(e);
        }
    }

    /**
     * 修改用户
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async edit(request, response, next) {
        try {
            const {user} = request.body;
            const currentUser = request.session.user;
            //检查是否重名
            let resData = this.userService.getUsersByCondition({
                condition: {
                    _id: {$ne: user._id},
                    name: user.name
                }
            });
            if(resData.result && resData.result.length > 0){
                next(new BusinessException('用户名已存在'));
            }else {
                resData = await this.userService.getUsersByCondition({
                    condition: {
                        _id: user._id
                    }
                });

                if(resData.result && resData.result.length > 0){
                    const originUser = resData.result[0];
                    if(currentUser.role < originUser.role){
                        next(new BusinessException(`您的角色权限低于${user.name}，不能编辑`));
                    }else if(currentUser.role < user.role){
                        next(new BusinessException(`您给${user.name}设置的角色权限不能高于您的角色权限`));
                    }else {
                        resData = await this.userService.saveOrUpdateUser(user);
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
    }

    /**
     * 头像上传
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async uploadIcon(req, res, next){
        try{
            const files = await PubFunction.uploadFiles(req, res, {
                subDir: 'user/icon/temp',
                fileFilter: ['.png', '.jpg']
            });
            if(files){
                files.forEach((item) => {
                    item.url = PubFunction.rebuildImgUrl(`uploads/user/icon/temp/${item.filename}`)
                });
                res.json({success: true, message: '头像上传成功', result: files});
            }else{
                next(new BusinessException('上传文件为空'));
            }
        } catch (e) {
            next(e);
        }
    }
}