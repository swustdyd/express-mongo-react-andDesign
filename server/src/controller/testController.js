import BaseController from './baseController';
import { log, before, after, requestSignin, requestAdmin, 
    requestSuperAdmin, route, Method, controller } from '../common/decorator'

@controller('/test')
export default class TestController extends BaseController{
    constructor(){
        super();
    }

    /**
     * 测试js语法
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/route/js', Method.GET)
    @requestSignin()
    @after((req, res, next) => {
        console.log('do something after');
    })
    @before((req, res, next) => {
        console.log('do something before');
        req._hahha = 'hahaha';
    })
    @log()
    testJS(req, res, next){
        try {
            const message = 'test js';
            console.log(message, req._hahha);
            res.json(message);
            res.end();
        } catch (error) {
            next(error);
        }
    }

    @requestAdmin()
    @after()
    @before()
    @route('/route/cheerio', Method.GET)
    @log()
    testCheerio(req, res, next){
        try {
            const message = 'test cheerio';
            console.log(message)
            res.json(message);
        } catch (error) {
            next(error);
        }
    }
}