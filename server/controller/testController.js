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
            //res.send(await this._rebuildDoubanMovie());
            // const resData = await HttpsUtil.getAsync({
            //     hostname: 'movie.douban.com',
            //     path: '/subject/26945085/?from=showing',
            //     headers:{
            //         'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            //         'Cookie': 'll="118318"; _vwo_uuid_v2=268A153A3B0C643D147E31481E0895A1|0a1395ad6b587e425cf1f4bd99fad90b; bid=fkXI8qz-GAc; ct=y; _ga=GA1.2.1991939520.1484715813; _gid=GA1.2.25358410.1526450489; push_noty_num=0; push_doumail_num=0; __utmc=30149280; ps=y; __utmc=223695111; __utma=30149280.1991939520.1484715813.1526521531.1526536367.4; __utmz=30149280.1526536367.4.4.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utmt=1; _gat_UA-7019765-1=1; dbcl2="178675845:hgQqVkcUHbQ"; ck=Pw6q; __utmv=30149280.17867; __utmb=30149280.4.10.1526536367; __utma=223695111.782172476.1501562695.1526521641.1526536459.13; __utmb=223695111.0.10.1526536459; __utmz=223695111.1526536459.13.8.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1526536459%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.4cf6=*; _pk_id.100001.4cf6=2b9398a388e83bef.1501562694.13.1526536472.1526521649.'
            //     }
            // }, 'utf-8');
            
            // const {statusCode} = resData;
            // if(statusCode === 200){
            //     const doubanDocument = $.load(resData.data);
            //     const doubanMovie = this._doubanMovieService.getDoubanDetail(doubanDocument);
            //     res.send(doubanMovie);
            // }else{
            //     next(resData.data)
            // }
            res.send('test');
        } catch (error) {
            next(error);
        }
    }
    

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