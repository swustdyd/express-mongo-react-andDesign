/*
 * @Author: dyd 
 * @Date: 2018-05-10 20:38:22 
 * @Last Modified by: dyd
 * @Last Modified time: 2018-05-10 20:43:32
 */
import BaseController from './baseController';


export default class TestController extends BaseController{
    constructor(){
        super()
    }

    /**
     * 测试js语法
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    testJS(req, res, next){
        try {
            var i = 1;
        } catch (error) {
            next(error);
        }
    }
}