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
    async testJS(req, res, next){
        try {
            // let i = 0;
            // let result = false;
            // while(i < 10){
            //     i++;
            //     result = await this.getTick();
            //     if(result){
            //         break;
            //     }
            // }
            //const result = await this.getTick();
            // const {id} = req.query;
            // const result = await this._movieService.getMovieById(id);
            const condition = new Condition('movie', 
                [
                    'movieId',
                    'name',
                    {
                        name: 'akaName',
                        alias: 'a',
                        as: 'aka_name'
                    }
                ],
                [
                    // {
                    //     name: 'name',
                    //     alias: 'movie',
                    //     opType: OpType.LIKE,
                    //     logicOpType: LogicOpType.AND,
                    //     value: '钢铁%'
                    // },
                    // {
                    //     name: 'createAt',
                    //     alias: 'movie',
                    //     opType: OpType.GTE,
                    //     logicOpType: LogicOpType.AND,
                    //     value: new Date()
                    // },
                    // {
                    //     name: 'movieId',
                    //     alias: 'movie',
                    //     opType: OpType.GTE,
                    //     logicOpType: LogicOpType.AND,
                    //     value: 1
                    // }
                ],
                [
                    {
                        name: 'akaWithOther',
                        alias: 'awo',
                        on:{
                            sourceKey: 'otherId',
                            targetKey: {
                                key: 'movieId',
                                alias: 'movie'
                            }
                        },
                        type: JoinType.LEFT
                    },
                    {
                        name: 'aka',
                        alias: 'a',
                        on:{
                            sourceKey: 'akaId',
                            targetKey: {
                                key: 'akaId',
                                alias: 'awo'
                            }, 
                            type: JoinType.LEFT
                        }
                    }
                ]
            );
            condition.setOffset(0),
            condition.setLimit(10);
            const sql = condition.toSql();
            const result = await db.query(sql, {type: db.QueryTypes.SELECT});
            if(result){                
                res.send(result);
            }else{
                next({message: 'no this movie'});
            }
        } catch (error) {
            next(error);
        }
    }

    async getTick(){
        const tickets = await mysqldb.query('select * from ticket where id = 1');
        const ticket = tickets[0];
        const result = await mysqldb.beginTransaction(async (connection) => {   
            let isSuccess =  false;                
            try {                                     
                if(ticket.count > 0){
                    const {changedRows} = await new Promise((resolve, reject) => {
                        mysqldb._connection.query(`update ticket set count = count - 1 where id = ${ticket.id} and count between 1 and ${ticket.count}`, (err, results) => {
                            if(err){
                                reject(err);
                            }
                            resolve(results);
                        });
                    }) 
                    if(changedRows > 0){
                        await mysqldb.insertOne('success_ticket', {
                            createAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), 
                            updateAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                        }); 
                        isSuccess = true; 
                    }                   
                }                    
                connection.commit((err) => {
                    if(err){
                        reject(err);
                    }
                });
            } catch (error) {
                connection.rollback((err) => {
                    if(err){
                        logger.error(err);
                        console.log(err);
                    }
                });
                logger.error(error);
            }
            return isSuccess;
        })
        return result;
    }

    async testCheerio(req, res, next){
        try {
            const proxy = 'http://forward.xdaili.cn:80';
            const orderno = 'ZF20185198833KDe2RM';
            const secret = 'd9709e1cd99b4d978dc840c315d568b4';
            const timestamp = parseInt(new Date().getTime() / 1000);
            const plantext = `orderno=${orderno},secret=${secret},timestamp=${timestamp}`;
            const md5 = crypto.createHash('md5');
            md5.update(plantext);
            let sign = md5.digest('hex');
            sign = sign.toUpperCase();
            const proxyAuthorization = `sign=${sign}&orderno=${orderno}&timestamp=${timestamp}`;
            const headers = {
                'Proxy-Authorization': proxyAuthorization
            }
            const resData = await HttpsUtil.getAsync({
                host: 'movie.douban.com',
                path: '/subject/3149755/?from=showing',
                headers: headers,
                rejectUnauthorized: false,
                agent: new HttpsProxyAgent(proxy),
                timeout: 5000
            }, 'utf-8')
            res.send(resData);
        } catch (error) {
            next(error);
        }
    }
    
    /**
     * 数据重建，谨慎调用
     */
    async _rebuildDoubanMovie(){
        console.log('开始重建数据');
        const propertyNames = ['actors', 'aka', 'countries', 'directors', 'languages', 'pubdates', 'types', 'writers'];
        const {total} = await this._doubanMovieService.getDoubanMovies();
        const pageSize = 20;
        const pageEndIndex = Math.ceil(total / pageSize);
        console.log(`电影总数为：${total}, pageEndIndex: ${pageEndIndex}, pageSize: ${pageSize}`);
        for(let pageIndex = 0; pageIndex < pageEndIndex; pageIndex++){
            console.log(`重建数据：${pageIndex * pageSize + 1} 到 ${pageIndex * pageSize + pageSize} 条`);
            const {result} = await this._doubanMovieService.getDoubanMovies(pageIndex, pageSize);
            for(let i = 0; i < result.length; i++){
                const doubanMovie = result[i];                
                propertyNames.forEach((key) => {
                    if(doubanMovie[key] instanceof Array){
                        const newArray = [];
                        doubanMovie[key].forEach((item) => {
                            if(item instanceof Array && item.length > 0){                                
                                newArray.push(item[0]);
                            }
                        })
                        doubanMovie[key] = newArray.length > 0 ? newArray : doubanMovie[key];                        
                    }
                })
                this._doubanMovieService.saveOrUpdateDoubanMovie(doubanMovie);
            }
        }     
        console.log('成功重建数据');
        return 'success';
    }
}