import $ from 'cheerio'
import request from 'request-promise-native'
import SpiderInfo from '../models/spiderInfo'
import DoubanMovieService from '../service/doubanMovieService'
import logger from '../common/logger'
import crypto from 'crypto'
import HttpsProxyAgent from 'https-proxy-agent'
import moment from 'moment'

/**
 * 常用 User-Agent
 */
const userAgents = [
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 OPR/26.0.1656.60',
    'Mozilla/5.0 (X11; U; Linux x86_64; zh-CN; rv:1.9.2.10) Gecko/20100922 Ubuntu/10.10 (maverick) Firefox/3.6.10',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2 ',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
    'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.133 Safari/534.16',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 UBrowser/4.0.3214.0 Safari/537.36'
]

/**
 * 豆瓣爬虫
 */
export default class DoubanSpider{
    constructor(){
        this.setting = {
            proxy: 'http://forward.xdaili.cn:80',
            timeout: 5000,
            maxTryTimes: 30,
            orderno: 'ZF20185198833KDe2RM',
            secret: 'd9709e1cd99b4d978dc840c315d568b4',
            pageLimit: 20
        };

        this.state = {
            requestCount: 0,
            successCount: 0,
            lastOffset: 0,
            currentOffset: 0
        }

        this._doubanMovieService = new DoubanMovieService();
    }

    /**
     * 开始豆瓣爬虫
     */
    async start(){
        try {
            console.log('douban spider start')
            const latestSpiderInfos = await SpiderInfo.find().limit(1).sort({'meta.updateAt': 'desc'}).exec();
            if(latestSpiderInfos && latestSpiderInfos.length > 0){
                this.state.currentOffset = this.state.lastOffset = latestSpiderInfos[0].offset;
                console.log(`lastOffset is ${this.state.lastOffset}, so this time start at offset ${this.state.lastOffset}`);
            }

            let subjects = [];
            do {
                const {currentOffset} = this.state;
                subjects = await this.getDoubanList(currentOffset);
                if(subjects.length > 0){
                    // //并发解析列表的数据，但是容易出现代理错误：Concurrent number exceeds limit
                    // const promiseList = [];
                    // subjects.forEach((item) => {
                    //     promiseList.push(this.parseAndSaveMovie(item.id, item.title));
                    // })
                    // await Promise.all(promiseList);                     
                    // this.state.currentOffset += subjects.length;
                    
                    //顺序解析，减少并发次数
                    for (let i = 0; i < subjects.length; i++) {
                        const item = subjects[i];
                        await this.parseAndSaveMovie(item.id, item.title);
                        this.state.currentOffset++;
                    }                     
                }

            } while (subjects.length > 0);
            
            console.log('all data has been parsed');
        } catch (error) {
            const {currentOffset, requestCount, successCount} = this.state;
            const spiderInfo = new SpiderInfo({
                offset: currentOffset,
                requestCount: requestCount,
                successCount: successCount
            });
            await spiderInfo.save();
            console.log(`douban spider stop, because of '${error.message}'`);
            console.log(`requestCount is ${requestCount}, successCount: '${successCount}'`);
            logger.error('douban spider stop', error);
        }
    }

    /**
     * 获取豆瓣电影数据列表
     * @param {*} offset 
     */
    async getDoubanList(offset: number){
        let subjects = [];
        let tryTimes = 0;
        while(tryTimes < this.setting.maxTryTimes){                
            tryTimes++;
            try {
                this.state.requestCount++;                    
                //获取列表数据
                console.log(`get list from '${offset + 1}' to '${offset + this.setting.pageLimit}'`);
                const {statusCode, body} = await request({
                    url: `https://movie.douban.com/j/new_search_subjects?tag=${encodeURIComponent('电影')}&sort=T&range=0,10&start=${offset}`,
                    resolveWithFullResponse: true,
                    rejectUnauthorized: false,
                    agent: new HttpsProxyAgent(this.setting.proxy),
                    headers: this.getRadomHeaders(),                
                    timeout: this.setting.timeout
                })
                if(statusCode === 200){
                    this.state.successCount++;
                    const {data: tempSubjects, msg} = JSON.parse(body);
                    //msg不为空，表示代理出错了
                    if(msg){
                        return Promise.reject(new Error(msg));
                    }
                    subjects = tempSubjects;
                    break;
                }else{
                    logger.error(`list request status code error: '${statusCode}'`, body);
                }
            } catch (error) {
                const message = `error on get list from '${offset + 1}' to '${offset + this.setting.pageLimit}', becsuse of '${error.message}'`;
                console.log(message);
                logger.error(message, error);
            }
            console.log('begin to try again');
        }

        if(tryTimes >= this.setting.maxTryTimes){
            return Promise.reject(new Error(`try to get list for '${tryTimes}' times, but is still not success`));
        }else{
            return subjects;
        }
    }

    /**
     * 根据id，发出请求，解析，并保存到数据库
     * @param {*} doubanMovieId 豆瓣电影id
     * @param {*} doubanMovieTitle 豆瓣电影名字
     */
    async parseAndSaveMovie(doubanMovieId: string, doubanMovieTitle: stirng){
        let tryTimes = 0;
        const maxTimes = 5;
        let doubanMovie = await this._doubanMovieService.getDoubanMoviesByDoubanid(doubanMovieId);
        if(doubanMovie){
            console.log(`parsed id: '${doubanMovieId}' title: '${doubanMovieTitle}'`);
        }else{
            while(tryTimes < maxTimes){                
                tryTimes++;
                this.state.requestCount++;                    
                //解析并保存到数据库
                const time = new Date().getTime();
                console.log(`parsing id: '${doubanMovieId}' title: '${doubanMovieTitle}' at ${moment(time).format('HH:mm:ss.SSS')}`);
                const {statusCode, body} = await request({
                    url: `https://movie.douban.com/subject/${doubanMovieId}/?from=showing`,
                    resolveWithFullResponse: true,
                    rejectUnauthorized: false,
                    agent: new HttpsProxyAgent(this.setting.proxy),
                    headers: this.getRadomHeaders()
                }).catch((error) => {
                    const message = `error on parsing id: '${doubanMovieId}' title: '${doubanMovieTitle}', statusCode is '${error.statusCode}'`;
                    console.log(message);
                    logger.error(message, error.message);
                })
                if(statusCode === 200){
                    try {
                        //检测代理是否正常
                        const {msg} = JSON.parse(body);
                        return Promise.reject(new Error(msg));
                    } catch (e) {
                        //返回的不是json数据，表示正常
                    }
                    const doubanDocument = $.load(body);
                    doubanMovie = this._doubanMovieService.getDoubanDetail(doubanDocument);
                    //添加豆瓣电影id
                    doubanMovie.doubanMovieId = doubanMovieId;
                    await this._doubanMovieService.saveOrUpdateDoubanMovie(doubanMovie);
                    this.state.successCount++;                      
                    console.log(`success id: '${doubanMovieId}' title: '${doubanMovieTitle}' at ${moment(new Date()).format('HH:mm:ss.SSS')}, cast: ${(new Date().getTime() - time)} ms`);
                    break;
                }else{
                    logger.error(`parsing request status code error: '${statusCode}'`, body);
                }               
                console.log('begin to try again');
            }
        }
        if(tryTimes >= maxTimes){
            const message = `try to parse id: '${doubanMovieId}' title: '${doubanMovieTitle}' for '${tryTimes}' times, but is still not success`;
            console.log(message);
            logger.error(message);
            //return Promise.reject(new Error(message));
        }      
    }

    /**
     * 获取随机的headers
     */
    getRadomHeaders(){
        const {orderno, secret} = this.setting;
        const timestamp = parseInt(new Date().getTime() / 1000);
        const plantext = `orderno=${orderno},secret=${secret},timestamp=${timestamp}`;
        const md5 = crypto.createHash('md5');
        md5.update(plantext);
        let sign = md5.digest('hex');
        sign = sign.toUpperCase();
        const proxyAuthorization = `sign=${sign}&orderno=${orderno}&timestamp=${timestamp}`;
        const radomUserAgentIndex = Math.floor(Math.random() * userAgents.length );
        const headers = {
            'User-Agent': userAgents[radomUserAgentIndex],
            'Proxy-Authorization': proxyAuthorization
        }
        return headers;
    }
}
