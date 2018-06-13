import jwt from 'jsonwebtoken'
import UserService from '../service/user'
import PubFunction from '../common/publicFunc'
import BusinessException from '../common/businessException'
import BaseController from './baseController';
import {tokenSecret} from '../../../baseConfig'
import Condition from '../db/condition'

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
            const condition = new Condition();
            condition.addWhere({
                name: 'name',
                value: _user.name
            })
            const pageResult = await this.userService.getUsersByCondition(condition);
            if(pageResult.result && pageResult.result.length > 0){
                next(new BusinessException('该用户名已存在'));
            }else {
                const newUser = await this.userService.saveOrUpdateUser(_user);
                const apiResponse = {};
                if(newUser){
                    apiResponse.success = true;
                    apiResponse.message = '注册成功'
                }else{
                    apiResponse.success = false;
                    apiResponse.message = '注册失败'
                }
                response.json(apiResponse);
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
            const condition = new Condition();
            condition.addWhere({
                name: 'name',
                value: name
            })
            const pageResult = await this.userService.getUsersByCondition(condition);
            const users = pageResult.result;
            if(!users || users.length < 1) {
                next(new BusinessException('用户名不存在！'));
            }else{
                const user = users[0];
                const isMatch = await PubFunction.comparePassword(password, user.password);
                if(isMatch){
                    //过滤敏感信息
                    user.password = '';
                    //默认过期时间30分钟
                    let expiresIn = 30 * 60;
                    //七天免登录
                    if(sevenDay){
                        expiresIn = 7 * 24 * 60 * 60;
                    }
                    const token = jwt.sign({user}, tokenSecret, {
                        expiresIn
                    })
                    response.json({
                        success: true,
                        message: '登录成功',
                        token
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
    logout(request, response, next) {
        // request.session.destroy((err) => {
        //     if(err){
        //         next(err);
        //     }else{                
        //         response.json({success: true, message: '登出成功'});
        //     }
        // })
        next(new BusinessException('登出功能已弃用'));
    }

    /**
     * 获取用户信息
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    async getUsers(request, response, next) {
        try {
            const {offset, pageSize} = request.query;
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
            const pageResult = await this.userService.getUsersByCondition(new Condition());
            response.json({success: true, ...pageResult});
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
    checkLogin(req, res, next) {
        try {            
            const token = req.get('Authorization');
            if(!token){
                res.json({success: false, message: 'token为空'});
            }else{
                jwt.verify(token, tokenSecret, (err, decoded) => {
                    if(err){
                        res.json({success: false, message: err.message});
                    }else{
                        const {user} = decoded;   
                        if(!user){
                            res.json({success: false, message: '用户为空'});
                        }else{
                            res.json({success: true, result: user});
                        }
                    }
                }); 
            }
        } catch (error) {
            next(error)
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