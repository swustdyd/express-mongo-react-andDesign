/*
 * @Author: dyd 
 * @Date: 2018-05-10 20:38:22 
 * @Last Modified by: dyd
 * @Last Modified time: 2018-05-10 20:43:32
 */
import $ from 'cheerio'
import https from 'https'
import HttpsUtil from '../common/httpsUtil'
import BaseController from './baseController';
import DoubanMovieServie from '../service/doubanMovieService';
import PublicFunction from '../common/publicFunc'

const testController = new BaseController();

export default class TestController extends BaseController{
    constructor(){
        super();
        this._doubanMovieService = new DoubanMovieServie();
    }

    /**
     * 测试js语法
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async testJS(req, res, next){
        try {
            console.log(`constructor name is '${testController.constructor.name}'`);
            for(const key in testController){
                console.log(key)
            }
            await PublicFunction.delay(5000);
            res.json(i);
        } catch (error) {
            next(error);
        }
    }

    testCheerio(req, res, next){
        try {                   
            res.send('testCheerio');
        } catch (error) {
            next(error);
        }
    }
}