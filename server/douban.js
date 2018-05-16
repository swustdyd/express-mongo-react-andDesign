import mongoose from 'mongoose'
import $ from 'cheerio'
import DoubanMovieService from './service/doubanMovieService'
import HttpsUtil from './common/httpsUtil'
import logger from './common/logger'
import PublicFunction from './common/publicFunc'
import BaseConfig from '../baseConfig'
import { getHashes } from 'crypto';

mongoose.connect(BaseConfig.dbConnectString);
const doubanMovieService = new DoubanMovieService();

export const tags = [
    '热门',  '最新',  '经典',  '可播放',  '豆瓣高分',  
    '冷门佳片',  '华语',  '欧美',  '韩国',  '日本',  
    '动作', '喜剧',  '爱情',  '科幻',  '悬疑',  '恐怖',  '动画'
]

/**
 * 分类起始下标
 */
const tagStartIndex = 0;
/**
 * 分类结束下标
 */
const tagEndIndex = tags.length - 1;
/**
 * 单个分类下，获取列表大小限制
 */
const pageLimit = 20;
/**
 * 单个分类下，从第几个列表开始获取
 */
const pageStartIndex = 0;
/**
 * 单个分类下，在第几个列表的结束
 */
const pageEndIndex = Number.MAX_SAFE_INTEGER; 
/**
 * 热度：recommend, 时间：time, 评论：rank
 */
const sort = 'recommend';
/**
 * 随机cookie
 */
//let radomCookie = getRadomCookie();
/**
 * 随机headers
 */
//let radomHeaders = getRadomHeaders();

process.on('uncaughtException', (err) => {
    console.log('/***** uncaughtException *****/', err);
    logger.error('uncaughtException', err);
});

process.nextTick(async () => {    
    console.log('/***** 豆瓣电影爬取服务开启 *****/')
    try {
        //逐个分类进行查询
        for(let i = tagStartIndex; i <= tagEndIndex; i++){
            await startGemovieFromDouban(i, sort);
        }        
        console.log('/***** 所有分类爬取完毕 *****/');
    } catch (error) {
        await mongoose.disconnect();
        console.log('/***** 豆瓣电影爬取服务出错 *****/', error)
        logger.error(error);
    }
    await mongoose.disconnect();
})

/**
 * 开始从豆瓣网获取movie
 * @param {*} tag 分类信息下标
 * @param {*} sort 排序
 */
async function startGemovieFromDouban(tagIndex: number, sort: string){
    if(tagIndex === undefined || !sort){
        console.log('/***** tagIndex, sort不能为空 *****/');
        return;
    }
    try {       
        const errorMovieIdArray = [];
        for(let i = pageStartIndex; i <= pageEndIndex; i++){
            const pageStart = i * pageLimit;
            const subjects = await getDoubanList(i, tagIndex);
            if(subjects.length < 1){
                console.log(`“${tags[tagIndex]}”已无更多的电影`);
                break;
            }
            for(let j = 0; j < subjects.length; j++){
                const item = subjects[j];
                try{
                    await parseAndSaveMovieWithTag(item.id, item.title, tagIndex, i * pageLimit + j + 1)
                }catch(e){
                    console.log(`/***** 电影 “${item.id}——${item.title}” 爬取出错 *****/`, e)
                    logger.error(`电影 “${item.id}——${item.title}” 爬取出错`, e);
                    errorMovieIdArray.push(item.id);
                }
            }              
        }
        if(errorMovieIdArray.length < 1){
            console.log(`“${tags[tagIndex]}” 爬取完毕`);
        }else{
            logger.error(`“${tags[tagIndex]}” 爬取过程中出错，出错的电影id列表为：${JSON.stringify(errorMovieIdArray)}`);
        }
        
    } catch (error) {
        console.log(`/***** “${tags[tagIndex]}” 爬取过程中，获取列表数据出错，爬取服务已停止  *****/`);
        logger.error(`“${tags[tagIndex]}” 爬取过程中，获取列表数据出错，爬取服务已停止`, error);
    }
}

/**
 * 
 * @param {*} doubanMovieId 豆瓣电影id
 * @param {*} doubanMovieTitle 豆瓣电影名字
 * @param {*} tagIndex 分类下标
 * @param {*} parseIndex 解析的顺序号
 */
async function parseAndSaveMovieWithTag(doubanMovieId: string, doubanMovieTitle: stirng, tagIndex: number, parseIndex: number){
    let doubanMovie = await doubanMovieService.getDoubanMoviesByDoubanid(doubanMovieId);
    if(doubanMovie){
        console.log(`电影 “${doubanMovieId}——${doubanMovieTitle}” 已被解析过`);
    }else{                        
        const resData = await HttpsUtil.getAsync({
            hostname: 'movie.douban.com',
            path: `/subject/${doubanMovieId}/?from=showing`,
            headers: getRadomHeaders()
        }, 'utf-8');
        
        //延时，免得被豆瓣封ip
        await PublicFunction.delay(2000);
        const {statusCode} = resData;
        if(statusCode === 200){
            const doubanDocument = $.load(resData.data);
            doubanMovie = doubanMovieService.getDoubanDetail(doubanDocument);
            //存放豆瓣电影id
            doubanMovie.doubanMovieId = doubanMovieId;
            const serviceRes = await doubanMovieService.saveDoubanMovie(doubanMovie);
            console.log(`第${parseIndex}部电影 “${doubanMovieId}——${serviceRes.result.name}” 解析成功`);
        }else{
            console.log(`/***** 第${parseIndex}部电影 “${doubanMovieId}——${doubanMovieTitle}” 解析失败, statusCode：${statusCode} *****/`);
            logger.error(`第${parseIndex}部电影 “${doubanMovieId}——${doubanMovieTitle}” 解析失败, statusCode：${statusCode} `, resData.data);
        }
    }

    //查询是否已存在该电影相同的分类信息
    const {result: doubanMovieAndTags} = await doubanMovieService.getDoubanMoviesAndTagByOption({
        condition: {
            tagIndex,
            doubanMovieId
        }
    });
    if(doubanMovieAndTags.length > 0){  
        console.log(`电影 “${doubanMovieId}——${doubanMovie.name}” 的分类 “${tags[tagIndex]}” 已存在`);      
    }else{        
        await doubanMovieService.saveDoubanMovieAndTag({
            doubanMovieId: doubanMovieId,
            mongoObjectId: doubanMovie._id,
            tagIndex: tagIndex
        });
    }
}

async function getDoubanList(pageIndex: number, tagIndex: number){
    const pageStart = pageIndex * pageLimit;
    let subjects = [];
    for(let tryStartIndex = 1; tryStartIndex <= 10; tryStartIndex++){
        try {                    
            //获取列表数据
            console.log(`获取“${tags[tagIndex]}”的列表数据 ${pageStart + 1} 到 ${pageStart + pageLimit} 条`);
            const resData = await HttpsUtil.getAsync({
                hostname: 'movie.douban.com',
                path: `/j/search_subjects?type=movie&tag=${encodeURIComponent(tags[tagIndex])}&sort=${sort}&page_limit=${pageLimit}&page_start=${pageStart}`,
                headers: getRadomHeaders()
            }, 'utf-8');            
            //延时，免得被豆瓣封ip
            await PublicFunction.delay(2000);
            const {statusCode} = resData;
            if(statusCode === 200){
                const {subjects: tempList} = JSON.parse(resData.data);
                subjects = tempList;
                break;
            }else{
                console.log(`/***** 请求“${tags[tagIndex]}”的列表数据 ${pageStart + 1} 到 ${pageStart + pageLimit} 条出错，statusCode：${statusCode} *****/`);
                logger.error(`请求“${tags[tagIndex]}”的列表数据 ${pageStart + 1} 到 ${pageStart + pageLimit} 条出错，statusCode：${statusCode} `, resData.data);
            }
        } catch (error) {
            logger.error(`获取“${tags[tagIndex]}”的列表数据 ${pageStart + 1} 到 ${pageStart + pageLimit} 条出错`, error);
            break;
        }
    }
    return subjects;
}

/**
 * 获取随机cookie
 */
function getRadomCookie() {
    const bid = Math.ceil(Math.random() * 10000);
    return `bid=${bid}; ll="${bid}"; _vwo_uuid_v2=268A153A3B0C643D147E31481E0895A1|0a1395ad6b587e425cf1f4bd99fad90b; ct=y; __utmc=30149280; __utma=30149280.1991939520.1484715813.1526445050.1526450039.22; __utmz=30149280.1526450039.22.19.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _ga=GA1.2.1991939520.1484715813; _gid=GA1.2.25358410.1526450489; dbcl2="178675845:ANpI/2A51zQ"; ck=nJu3; push_noty_num=0; push_doumail_num=0; __utmv=30149280.17867; __utmb=30149280.7.10.1526450039; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1526450505%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.4cf6=*; __utma=223695111.782172476.1501562695.1526438955.1526450505.11; __utmb=223695111.0.10.1526450505; __utmc=223695111; __utmz=223695111.1526450505.11.6.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_id.100001.4cf6=2b9398a388e83bef.1501562694.11.1526450517.1526440137.`
}

/**
 * 获取随机的headers
 */
function getRadomHeaders(){
    const cookie = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
        'Cookie': getRadomCookie()
    }
    return cookie;
}