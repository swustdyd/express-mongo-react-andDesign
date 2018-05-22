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
import DoubanMovieServie from '../service/doubanMovieService';
import PublicFunction from '../common/publicFunc'
import Proxy from '../models/proxy'
import crypto from 'crypto'
import HttpsProxyAgent from 'https-proxy-agent'
import Url from 'url'
import jade from 'jade'
import EmailUtil from '../common/emailUtil'
import path from 'path'
import BaseConfig from '../../baseConfig'

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
            const errorMovies = [
                {
                    id: '1',
                    title: 'test1'
                },
                {
                    id: '1',
                    title: 'test1'
                },
                {
                    id: '1',
                    title: 'test1'
                }
            ]
            const html = jade.renderFile(path.join(BaseConfig.root, './server/mailTemplate/doubanSpider.jade'), {
                reason: 'no reason',
                requestCount: 100,
                successCount: 100,
                errorTip: 'The count of error movie is <strong>3</strong>',
                startTime: '2018-5-21 15:50:32',
                endTime: '2018-5-21 15:50:32',
                errorMovies: errorMovies
            })
            const info = await EmailUtil.sendEmail({
                to: '1562044678@qq.com',
                subject: 'Test NodeMailer',
                html: html,
                attachments: [
                    {   // utf-8 string as an attachment
                        filename: 'error-movies.json',
                        content: JSON.stringify(errorMovies)
                    }
                ]
            });
            res.send(html);
        } catch (error) {
            next(error);
        }
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