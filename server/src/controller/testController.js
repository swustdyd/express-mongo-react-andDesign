/*
 * @Author: dyd 
 * @Date: 2018-05-10 20:38:22 
 * @Last Modified by: dyd
 * @Last Modified time: 2018-05-10 20:43:32
 */
import $ from 'cheerio'
import https from 'https'
import request from 'request-promise-native'
import HttpsUtil from '../common/httpsUtil'
import BaseController from './baseController';
import PublicFunction from '../common/publicFunc'
import crypto from 'crypto'
import HttpsProxyAgent from 'https-proxy-agent'
import Url from 'url'
import jade from 'jade'
import EmailUtil from '../common/emailUtil'
import path, { resolve } from 'path'
import BaseConfig from '../../../baseConfig'
import moment from 'moment'      
import logger from '../common/logger';        
import MovieService from '../service/movie'
import Condition, {JoinType, OpType, LogicOpType} from '../db/condition'
import { db } from '../db';
import {log, before, after, requestSignin, requestAdmin, requestSuperAdmin, route, Method, controller} from '../common/decorator'

@controller('/test')
export default class TestController extends BaseController{
    constructor(){
        super();
        this._movieService = new MovieService();
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