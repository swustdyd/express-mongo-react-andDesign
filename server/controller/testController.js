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
            const timestamp = parseInt(new Date().getTime() / 1000);
            const orderno = 'ZF2017971234567';
            const secret = 'cb65091847ad412345678910';
            const plantext = `orderno=${orderno},secret=${secret},timestamp=${timestamp}`;
            const md5 = crypto.createHash('md5');
            md5.update(plantext);
            let sign = md5.digest('hex');
            sign = sign.toUpperCase();
            const resData = await request({
                method: 'GET',
                // https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=20&page_start=0
                url: 'https://www.baidu.com',
                resolveWithFullResponse: true,
                rejectUnauthorized: false,
                followRedirect: false,
                proxy: 'http://forward.xdaili.cn:80',
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 OPR/26.0.1656.60',
                    'Proxy-Authorization':`sign=${sign}&orderno=${orderno}&timestamp=${timestamp}`
                }
            })
            // console.log(statusCode);
            // const data = JSON.parse(body);
            res.send(resData);
        } catch (error) {
            next(error);
        }
    }

    async testCheerio(req, res, next){
        try {
            const proxys = await Proxy.find();
            const activeProxys = [];
            for (let i = 0; i < proxys.length; i++) {
                const proxy = proxys[i];
                let active = true;
                try {
                    const {statusCode} = await request({
                        method: 'GET',
                        url: 'https://movie.douban.com//subject/24773958/?from=showing',
                        resolveWithFullResponse: true,
                        proxy: `${proxy.protocol}://${proxy.ip}:${proxy.port}`,
                        timeout: 5000
                    })
                    active = statusCode === 200;
                } catch (error) {
                    console.log(error);
                    active = false;
                }
                
                if(!active){ 
                    await Proxy.remove({ip: proxy.ip});
                }else{
                    activeProxys.push(proxy);
                }
            }            
            res.send(activeProxys);
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