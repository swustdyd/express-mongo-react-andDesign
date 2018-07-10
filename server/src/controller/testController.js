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

const log = (target, name, descriptor) => {
    const oldValue = descriptor.value;

    descriptor.value = function() {
        console.log(target.constructor.name, name, descriptor);
        oldValue.apply(this, arguments);
    };

    return descriptor;
}

const before = (target, name, descriptor) => {
    const oldValue = descriptor.value;

    descriptor.value = function() {
        console.log('before', target.constructor.name, name);
        oldValue.apply(this, arguments);
    };

    return descriptor;
}

const after = (target, name, descriptor) => {
    const oldValue = descriptor.value;

    descriptor.value = function() {
        oldValue.apply(this, arguments);
        console.log('after', target.constructor.name, name);
    };

    return descriptor;
}

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
    @after
    @before
    @log
    testJS(req, res, next){
        try {
            this.getTick();
            const message = 'test js';
            console.log(message)
            res.json(message);
        } catch (error) {
            next(error);
        }
    }

    @after
    @before
    @log
    getTick(){
        const message = 'get tick';
        console.log(message)
    }

    @after
    @before
    @log
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