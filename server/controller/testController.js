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

    async testCheerio(req, res, next){
        try {                   
            const resData = await HttpsUtil.getAsync({
                hostname: 'movie.douban.com',
                path: `/j/search_subjects?type=movie&tag=${encodeURIComponent('热门')}&sort=recommend&page_limit=20&page_start=0`,
                headers: {
                    Cookie: 'll="118318"; _vwo_uuid_v2=268A153A3B0C643D147E31481E0895A1|0a1395ad6b587e425cf1f4bd99fad90b; bid=11; ct=y; __utmc=30149280; __utma=30149280.1991939520.1484715813.1526445050.1526450039.22; __utmz=30149280.1526450039.22.19.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _ga=GA1.2.1991939520.1484715813; _gid=GA1.2.25358410.1526450489; dbcl2="178675845:ANpI/2A51zQ"; ck=nJu3; push_noty_num=0; push_doumail_num=0; __utmv=30149280.17867; __utmb=30149280.7.10.1526450039; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1526450505%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.4cf6=*; __utma=223695111.782172476.1501562695.1526438955.1526450505.11; __utmb=223695111.0.10.1526450505; __utmc=223695111; __utmz=223695111.1526450505.11.6.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_id.100001.4cf6=2b9398a388e83bef.1501562694.11.1526450517.1526440137.'
                }
            }, 'utf-8');
            res.send(resData);
        } catch (error) {
            next(error);
        }
    }
}