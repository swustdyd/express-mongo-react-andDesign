import $ from 'cheerio'
import request from 'request'
import crypto from 'crypto'
import path from 'path'
import HttpsProxyAgent from 'https-proxy-agent'
import moment from 'moment'
import jade from 'jade'
import SpiderInfo from './models/spiderInfo'
import DoubanMovieService from './service/mongoMovieServie'
import logger from '../common/logger'
import EmailUtil from '../common/emailUtil'
import BaseConfig from '../../../baseConfig'
import HttpsUtil from '../common/httpsUtil'

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
            timeout: 3000,
            maxTryTimes: 30,
            orderno: 'ZF20185198833KDe2RM',
            secret: 'd9709e1cd99b4d978dc840c315d568b4',
            pageLimit: 20,
            noResponsTimeOut: 5 * 60 *1000 //5分钟无反应，停止spider
        };

        this.state = {
            requestCount: 0,
            successCount: 0,
            lastOffset: 0,
            currentOffset: 0,
            errorMovies: [],
            stopReason: '',
            constraintStop: false,
            startTime: new Date()
        }

        this._doubanMovieService = new DoubanMovieService();
    }

    /**
     * 开始豆瓣爬虫
     */
    async start(){
        const {startTime, constraintStop} = this.state;
        try {
            console.log(`douban spider start at ${moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS')}`);
            const latestSpiderInfos = await SpiderInfo.find().limit(1).sort({'meta.updateAt': 'desc'}).exec();
            if(latestSpiderInfos && latestSpiderInfos.length > 0){
                this.state.currentOffset = this.state.lastOffset = latestSpiderInfos[0].offset;
                console.log(`lastOffset is ${this.state.lastOffset}, so this time start at offset ${this.state.lastOffset}`);
            }

            let subjects = [];
            do {
                const {currentOffset} = this.state;
                const {maxTryTimes, pageLimit, noResponsTimeOut} = this.setting;                
                let tryTimes = 0;
                while(tryTimes < maxTryTimes){ 
                    tryTimes++;
                    // //监听是否阻塞不运行
                    // const checkTimer = setTimeout(() => {
                    //     this.state.constraintStop = true;
                    //     this.state.stopReason = `spider no respond for ${(new Date().getTime() - requestStartTime.getTime()) / 1000}s, at get list from '${currentOffset + 1}' to '${currentOffset + pageLimit}'`;                         
                    // }, noResponsTimeOut);
                    try {
                        const requestStartTime = new Date();
                        console.log(`get list from '${currentOffset + 1}' to '${currentOffset + pageLimit}', at ${moment(requestStartTime).format('YYYY-MM-DD HH:mm:ss.SSS')}`);
                        this.state.requestCount++;                     
                        subjects = await this.getDoubanList(currentOffset);
                        // clearTimeout(checkTimer);
                        break;
                    } catch (error) {
                        const message = `error on get list from '${currentOffset + 1}' to '${currentOffset + pageLimit}', becsuse of '${error.message}'`;
                        console.log(message);
                        logger.error(message);
                        if(tryTimes >= maxTryTimes){
                            throw new Error(`try to get list for '${tryTimes}' times, but is still not success`);
                        }
                        // clearTimeout(checkTimer);
                    }                    
                    console.log('begin to get list again');
                }
                                
                //顺序解析，减少并发次数
                for (let i = 0; i < subjects.length; i++) {
                    const item = subjects[i];
                    const requestStartTime = new Date();
                    // //监听是否阻塞不运行
                    // const checkTimer = setTimeout(() => {
                    //     this.state.constraintStop = true;
                    //     this.state.stopReason = `spider no respond for ${(new Date().getTime() - requestStartTime.getTime()) / 1000}s, at parsing movie: ${item.title}`;                        
                    // }, noResponsTimeOut);
                    const success = await this.parseAndSaveMovie(item.id, item.title);
                    // clearTimeout(checkTimer);
                    if(!success){
                        this.state.errorMovies.push({id: item.id, title: item.title});
                    }
                    this.state.currentOffset++;
                }                    
                

            } while (subjects.length > 0 && !this.state.constraintStop);            
            if(!this.state.constraintStop){                
                this.state.stopReason = 'all data has been parsed';
                console.log(this.state.stopReason);
            }
        } catch (error) {
            this.state.stopReason = error.message;           
            logger.error('douban spider stop', error);
        }
        await this.handleSpiderStop();
    }

    async handleSpiderStop(){
        const endTime = new Date();
        const {currentOffset, requestCount, successCount, errorMovies, startTime, stopReason} = this.state;
        const spiderInfo = new SpiderInfo({
            offset: currentOffset,
            requestCount: requestCount,
            successCount: successCount,
            errorMovies: errorMovies,
            startTime: startTime,
            endTime: endTime
        });        
        await spiderInfo.save();
        const startTimeStr = moment(startTime).format('YYYY-MM-DD HH:mm:ss.SSS');
        const endTimeStr = moment(endTime).format('YYYY-MM-DD HH:mm:ss.SSS');
        console.log(`requestCount is ${requestCount}, successCount: '${successCount}', from ${startTimeStr} to ${endTimeStr}`);

        const jadeOption = {
            reason: stopReason,
            requestCount: requestCount,
            successCount: successCount,
            errorCount: errorMovies.length,
            errorTip: 'The count of error movie is <strong>3</strong>',
            startTime: startTimeStr,
            endTime: endTimeStr
        }

        const attachments = [];
        if(errorMovies.length >= 50){
            jadeOption.errorTip = `The count of error movie is <strong>${errorMovies.length}</strong>, more detail is on the attachments: <strong>error-movies.json</strong> `
            attachments.push(
                {   // utf-8 string as an attachment
                    filename: 'error-movies.json',
                    content: JSON.stringify(errorMovies)
                }
            );
            jadeOption.errorMovies = [];//errorMovies.slice(0, 49);
        }else{
            jadeOption.errorTip = `The count of error movie is <strong>${errorMovies.length}</strong>`
            jadeOption.errorMovies = errorMovies;
        }

        const html = jade.renderFile(path.join(BaseConfig.root, './server/mailTemplate/doubanSpider.jade'), jadeOption);

        console.log(`douban spider stop, because of '${stopReason}'`); 

        await EmailUtil.sendEmail({
            to: '1562044678@qq.com',
            subject: 'Douban Spider Stop',
            html: html,
            attachments: attachments
        });
        process.exit();
    }

    /**
     * 获取豆瓣电影数据列表
     * @param {*} offset 
     */
    async getDoubanList(offset: number){
        if(this.state.constraintStop){
            return [];
        }
        try {               
            //获取列表数据
            const {body, statusCode} = await HttpsUtil.getAsync({
                host: 'movie.douban.com',
                path: `/j/new_search_subjects?&sort=T&range=0,10&start=${offset}`,
                rejectUnauthorized: false,
                agent: new HttpsProxyAgent(this.setting.proxy),
                headers: this.getRadomHeaders(),                
                timeout: this.setting.timeout
            });
            if(statusCode === 200){
                this.state.successCount++;
                const {data, msg} = JSON.parse(body);
                //msg不为空，表示代理出错了
                if(msg){
                    return Promise.reject(new Error(msg));
                }
                return data;
            }else{
                return Promise.reject(new Error(`error code ${statusCode}`));
            }
        }catch(error){
            return Promise.reject(error);
        }
        // return new Promise((resolve, reject) => {               
        //     //获取列表数据
        //     request({
        //         url: `https://movie.douban.com/j/new_search_subjects?tag=${encodeURIComponent('电影')}&sort=T&range=0,10&start=${offset}`,
        //         resolveWithFullResponse: true,
        //         rejectUnauthorized: false,
        //         agent: new HttpsProxyAgent(this.setting.proxy),
        //         headers: this.getRadomHeaders(),                
        //         timeout: this.setting.timeout
        //     }, (error, response, body) => {
        //         if(error){
        //             reject(error);
        //             return;
        //         }
        //         const {statusCode} = response;
        //         if(statusCode === 200){
        //             this.state.successCount++;
        //             const {data, msg} = JSON.parse(body);
        //             //msg不为空，表示代理出错了
        //             if(msg){
        //                 reject(new Error(msg));
        //             }
        //             resolve(data);
        //         }else{
        //             reject(new Error(`error code ${statusCode}`));
        //         }
        //     })
        // })        
    }

    /**
     * 根据id，发出请求，解析，并保存到数据库
     * @param {*} doubanMovieId 豆瓣电影id
     * @param {*} doubanMovieTitle 豆瓣电影名字
     */
    async parseAndSaveMovie(doubanMovieId: string, doubanMovieTitle: stirng) : Promise<boolean>{
        if(this.state.constraintStop){
            return true;
        }
        let doubanMovie = await this._doubanMovieService.getDoubanMoviesByDoubanid(doubanMovieId);
        if(doubanMovie){
            console.log(`parsed id: '${doubanMovieId}' title: '${doubanMovieTitle}'`);
            return true;
        }else{
            let tryTimes = 0;
            do {                
                try {
                    tryTimes++;
                    this.state.requestCount++;                    
                    //解析并保存到数据库
                    const time = new Date().getTime();
                    console.log(`parsing id: '${doubanMovieId}' title: '${doubanMovieTitle}' at ${moment(time).format('HH:mm:ss.SSS')}`);
                    const {body, statusCode} = await HttpsUtil.getAsync({
                        host: 'movie.douban.com',
                        path: `/subject/${doubanMovieId}/?from=showing`,
                        rejectUnauthorized: false,
                        agent: new HttpsProxyAgent(this.setting.proxy),
                        headers: this.getRadomHeaders(),
                        timeout: this.setting.timeout
                    }, 'utf-8');
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
                        return true;
                        //break;                        
                    }else{
                        const message = `error on parsing id '${doubanMovieId}' title '${doubanMovieTitle}', because of 'error code ${statusCode}'`;
                        console.log(message);
                        logger.error(message);
                        if(statusCode === 404){
                            return false;
                        }
                    } 
                    console.log('begin to parse again');                 
                } catch (error) {
                    const message = `error on parsing id '${doubanMovieId}' title '${doubanMovieTitle}', because of '${error.message}'`;
                    console.log(message);
                    logger.error(message);
                    //return false;
                }
                if(tryTimes >= this.setting.maxTryTimes ){
                    return Promise.reject(new Error(`try to parse for '${tryTimes}' times, but is still not success`))
                }
            } while (tryTimes < this.setting.maxTryTimes);     
        }
        // return new Promise(async (resolve, reject) => {
        //     let doubanMovie = await this._doubanMovieService.getDoubanMoviesByDoubanid(doubanMovieId);
        //     if(doubanMovie){
        //         console.log(`parsed id: '${doubanMovieId}' title: '${doubanMovieTitle}'`);
        //         resolve(true);
        //     }else{
        //         this.state.requestCount++;                    
        //         //解析并保存到数据库
        //         const time = new Date().getTime();
        //         console.log(`parsing id: '${doubanMovieId}' title: '${doubanMovieTitle}' at ${moment(time).format('HH:mm:ss.SSS')}`);
        //         request({
        //             url: `https://movie.douban.com/subject/${doubanMovieId}/?from=showing`,
        //             resolveWithFullResponse: true,
        //             rejectUnauthorized: false,
        //             agent: new HttpsProxyAgent(this.setting.proxy),
        //             headers: this.getRadomHeaders(),
        //             timeout: this.setting.timeout
        //         }, async (error, response, body) => {
        //             if(error){                        
        //                 const message = `error on parsing id '${doubanMovieId}' title '${doubanMovieTitle}', because of '${error.message}'`;
        //                 console.log(message);
        //                 logger.error(message);
        //                 resolve(false);
        //                 return;
        //             }
        //             const {statusCode} = response;
        //             if(statusCode === 200){
        //                 try {
        //                     //检测代理是否正常
        //                     const {msg} = JSON.parse(body);
        //                     reject(new Error(msg));
        //                 } catch (e) {
        //                     //返回的不是json数据，表示正常
        //                 }
        //                 try {
        //                     const doubanDocument = $.load(body);
        //                     doubanMovie = this._doubanMovieService.getDoubanDetail(doubanDocument);
        //                     //添加豆瓣电影id
        //                     doubanMovie.doubanMovieId = doubanMovieId;
        //                     await this._doubanMovieService.saveOrUpdateDoubanMovie(doubanMovie);
        //                     this.state.successCount++;                      
        //                     console.log(`success id: '${doubanMovieId}' title: '${doubanMovieTitle}' at ${moment(new Date()).format('HH:mm:ss.SSS')}, cast: ${(new Date().getTime() - time)} ms`);
        //                     resolve(true);
        //                 } catch (error) {
        //                     const message = `error on parsing id '${doubanMovieId}' title '${doubanMovieTitle}', because of '${error.message}'`;
        //                     console.log(message);
        //                     logger.error(message);
        //                     resolve(false);
        //                 }
                        
        //             }else{
        //                 const message = `error on parsing id '${doubanMovieId}' title '${doubanMovieTitle}', because of 'error code ${statusCode}'`;
        //                 console.log(message);
        //                 logger.error(message);
        //                 resolve(false);
        //             }               
        //         })
        //     }
        // })
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
