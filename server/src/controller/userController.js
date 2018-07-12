import jwt from 'jsonwebtoken'
import UserService from '../service/user'
import PubFunction from '../common/publicFunc'
import BusinessException from '../common/businessException'
import BaseController from './baseController';
import {tokenSecret} from '../../../baseConfig'
import Condition, {OpType} from '../db/condition'
import {controller, route, Method, requestSignin, requestAdmin, requestSuperAdmin} from '../common/decorator'

@controller('/user')
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
    @route('/signup', Method.POST)
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
    @route('/signin', Method.POST)
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
                    response.json({
                        success: true,
                        message: '登录成功', 
                        result: user
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
    @route('/logout')
    logout(request, response, next) {
        request.session.destroy((err) => {
            if(err){
                next(err);
            }else{                
                response.json({success: true, message: '登出成功'});
            }
        })
    }

    /**
     * 获取用户信息
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    @requestSignin()
    @requestAdmin()
    @route('/getUsers')
    async getUsers(request, response, next) {
        try {
            const {offset, pageSize, name, role, userId} = request.query;
            const condition = new Condition(['name', 'role', 'userId', 'createAt', 'updateAt', 'icon']);
            if(name){
                condition.addWhere({
                    name: 'name',
                    value: `${name}%`,
                    opType: OpType.LIKE
                })
            }
            if(role){
                condition.addWhere({
                    name: 'role',
                    value: parseInt(role)
                })
            }
            if(userId){
                condition.addWhere({
                    name: 'userId',
                    value: parseInt(userId)
                })
            }
            const pageResult = await this.userService.getUsersByCondition(condition);
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
    @requestSignin()
    @route('/updatePwd', Method.POST)
    async updatePwd(request, response, next) {
        try {
            const {originPwd, newPwd} = request.body;
            const {userId} = request.session.user;

            const user = await this.userService.getUserById(userId);
            if(!user){
                next(new BusinessException('该用户不存在'));
            }else{
                const isMatch = await PubFunction.comparePassword(originPwd, user.password);
                if(isMatch){
                    await this.userService.saveOrUpdateUser({
                        userId: userId,
                        password: newPwd
                    });
                    response.json({
                        success: true,
                        message: '修改密码成功'
                    });
                }else{
                    next(new BusinessException('原密码不正确'));
                }
            }
        }catch (err){
            next(err);
        }
    }

    /**
     * 检查是否登录
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    @route('/checkLogin')
    checkLogin(req, res, next) {
        try {            
            // const token = req.get('Authorization');
            // if(!token){
            //     res.json({success: false, message: 'token为空'});
            // }else{
            //     jwt.verify(token, tokenSecret, (err, decoded) => {
            //         if(err){
            //             res.json({success: false, message: err.message});
            //         }else{
            //             const {user} = decoded;   
            //             if(!user){
            //                 res.json({success: false, message: '用户为空'});
            //             }else{
            //                 res.json({success: true, result: user});
            //             }
            //         }
            //     }); 
            // }
            if(req.session.user){
                res.json({
                    success: true,
                    result: req.session.user
                })
            }else {
                res.json({success: false})
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
    @requestSuperAdmin()
    @route('/delete')
    async delete(request, response, next) {
        try {
            const id = request.param('id');
            if(request.session.user.userId === id){
                next(new BusinessException('当前用户不能删除'));
            }else{
                const success = await this.userService.deleteUserById(id);
                response.json({success});
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
    @requestAdmin()
    @route('/edit', Method.POST)
    async edit(request, response, next) {
        try {
            const {user} = request.body;
            const currentUser = request.session.user;
            
            //检查是否重名
            let condition = new Condition();
            condition.addWhere({
                name: 'name',
                value: user.name
            })
            condition.addWhere({
                name: 'userId',
                value: user.userId,
                opType: OpType.NEQ
            })
            let pageResult = await this.userService.getUsersByCondition(condition);
            if(pageResult.result && pageResult.result.length > 0){
                next(new BusinessException('用户名已存在'));
            }else {
                //查询出要修改的用户
                condition = new Condition();
                condition.addWhere({
                    name: 'userId',
                    value: user.userId
                })
                pageResult = await this.userService.getUsersByCondition(condition);

                if(pageResult.result && pageResult.result.length > 0){
                    const originUser = pageResult.result[0];
                    if(currentUser.role < originUser.role){
                        next(new BusinessException(`您的角色权限低于${user.name}，不能编辑`));
                    }else if(currentUser.role < user.role){
                        next(new BusinessException(`您给${user.name}设置的角色权限不能高于您的角色权限`));
                    }else {
                        await this.userService.saveOrUpdateUser(user);
                        response.json({
                            success: true,
                            message: '保存成功'
                        });
                    }
                }else {
                    next(new BusinessException(`用户(${user.userId})不存在`));
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
    @requestSignin()
    @route('/uploadIcon', Method.POST)
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