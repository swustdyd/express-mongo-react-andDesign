import $ from 'cheerio'
import request from 'request-promise-native'
import SpiderInfo from '../models/spiderInfo'
import DoubanMovieService from '../service/doubanMovieService'
import HttpsUtil from '../common/httpsUtil'
import logger from '../common/logger'
import PublicFunction from '../common/publicFunc'
import BaseConfig from '../../baseConfig'

const doubanMovieService = new DoubanMovieService();

/**
 * 记录请求成功数目
 */
let httpsSuccessCount = 0;
/**
 * 记录成功解析的次数
 */
let parseSuccessCount = 0;

const tags = [
    '热门',  '最新',  '经典',  '可播放',  '豆瓣高分',  
    '冷门佳片',  '华语',  '欧美',  '韩国',  '日本',  
    '动作', '喜剧',  '爱情',  '科幻',  '悬疑',  '恐怖',  '动画'
];

/**
 * 用过的豆瓣cookie，看看能否破解
 */
const doubanCookies = [
    'll="118318"; _vwo_uuid_v2=268A153A3B0C643D147E31481E0895A1|0a1395ad6b587e425cf1f4bd99fad90b; bid=fkXI8qz-GAc; ct=y; _ga=GA1.2.1991939520.1484715813; _gid=GA1.2.25358410.1526450489; push_noty_num=0; push_doumail_num=0; __utmc=30149280; ps=y; __utmc=223695111; __utma=30149280.1991939520.1484715813.1526521531.1526536367.4; __utmz=30149280.1526536367.4.4.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utmt=1; _gat_UA-7019765-1=1; dbcl2="178675845:hgQqVkcUHbQ"; ck=Pw6q; __utmv=30149280.17867; __utmb=30149280.4.10.1526536367; __utma=223695111.782172476.1501562695.1526521641.1526536459.13; __utmb=223695111.0.10.1526536459; __utmz=223695111.1526536459.13.8.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1526536459%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.4cf6=*; _pk_id.100001.4cf6=2b9398a388e83bef.1501562694.13.1526536472.1526521649.',
    'll="118318"; _vwo_uuid_v2=268A153A3B0C643D147E31481E0895A1|0a1395ad6b587e425cf1f4bd99fad90b; bid=fkXI8qz-GAc; ct=y; _ga=GA1.2.1991939520.1484715813; _gid=GA1.2.25358410.1526450489; push_noty_num=0; push_doumail_num=0; __utmc=30149280; ps=y; __utmc=223695111; __utmv=30149280.17867; __utma=30149280.1991939520.1484715813.1526536367.1526542648.5; __utmz=30149280.1526542648.5.5.utmcsr=accounts.douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/safety/unlock_sms/resetpassword; __utmt=1; dbcl2="178675845:SCWwIdusqZQ"; ck=TDwN; __utmb=30149280.3.10.1526542648; __utma=223695111.782172476.1501562695.1526536459.1526542669.14; __utmb=223695111.0.10.1526542669; __utmz=223695111.1526542669.14.9.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1526542669%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.4cf6=*; _pk_id.100001.4cf6=2b9398a388e83bef.1501562694.14.1526542823.1526536472.',
    'll="118318"; _vwo_uuid_v2=268A153A3B0C643D147E31481E0895A1|0a1395ad6b587e425cf1f4bd99fad90b; bid=fkXI8qz-GAc; ct=y; _ga=GA1.2.1991939520.1484715813; _gid=GA1.2.25358410.1526450489; push_noty_num=0; push_doumail_num=0; __utmc=30149280; ps=y; __utmc=223695111; __utmv=30149280.17867; __utma=30149280.1991939520.1484715813.1526542648.1526549136.6; __utmz=30149280.1526549136.6.6.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utmt=1; _gat_UA-7019765-1=1; dbcl2="178675845:A9HrDkfWGLM"; ck=JcDw; __utmb=30149280.4.10.1526549136; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1526549246%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.4cf6=*; __utma=223695111.782172476.1501562695.1526542669.1526549246.15; __utmb=223695111.0.10.1526549246; __utmz=223695111.1526549246.15.10.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_id.100001.4cf6=2b9398a388e83bef.1501562694.15.1526549260.1526542823.',
    'll="118318"; bid=vjsHjHlnwLk; __yadk_uid=KcwFj36IDYtfMCCcbIvW0WvBmECi2OUp; ps=y; _vwo_uuid_v2=D13A1E2CA9F099C5F03963125D6884832|48861d9c1aa1c9357e7778210a464d33; __utmt=1; dbcl2="178675845:boYlLr//cHw"; ck=O-Qz; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1526564577%2C%22https%3A%2F%2Faccounts.douban.com%2Flogin%3Falias%3D18381669933%26redir%3Dhttps%253A%252F%252Fmovie.douban.com%252F%26source%3DNone%26error%3D1013%22%5D; _pk_id.100001.4cf6=6d19214551336a9b.1526515966.2.1526564585.1526515969.; _pk_ses.100001.4cf6=*; __utma=30149280.844991547.1526515961.1526515961.1526564502.2; __utmb=30149280.2.10.1526564502; __utmc=30149280; __utmz=30149280.1526564502.2.2.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utma=223695111.921000792.1526515966.1526515966.1526564577.2; __utmb=223695111.0.10.1526564577; __utmc=223695111; __utmz=223695111.1526564577.2.2.utmcsr=accounts.douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/login; push_noty_num=0; push_doumail_num=0',
    'll="118318"; _vwo_uuid_v2=268A153A3B0C643D147E31481E0895A1|0a1395ad6b587e425cf1f4bd99fad90b; bid=fkXI8qz-GAc; ct=y; _ga=GA1.2.1991939520.1484715813; _gid=GA1.2.25358410.1526450489; push_noty_num=0; push_doumail_num=0; ps=y; __utmv=30149280.17867; __utmc=30149280; __utmc=223695111; __yadk_uid=N5x9XuFvFGEmEDljyt2GTxdl6UcQv5fI; __utma=30149280.1991939520.1484715813.1526628853.1526630817.10; __utmz=30149280.1526630817.10.9.utmcsr=accounts.douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/safety/unlock_sms/resetpassword; __utmt=1; __utmb=30149280.1.10.1526630817; dbcl2="178675845:GHJzo6raewc"; ck=OGYO; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1526630832%2C%22https%3A%2F%2Fwww.douban.com%2Faccounts%2Flogin%3Fredir%3Dhttps%253A%252F%252Fmovie.douban.com%252F%22%5D; _pk_ses.100001.4cf6=*; __utma=223695111.782172476.1501562695.1526625707.1526630832.18; __utmb=223695111.0.10.1526630832; __utmz=223695111.1526630832.18.13.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/accounts/login; _pk_id.100001.4cf6=2b9398a388e83bef.1501562694.18.1526630838.1526626641.',
    'll="118318"; bid=vjsHjHlnwLk; __yadk_uid=KcwFj36IDYtfMCCcbIvW0WvBmECi2OUp; ps=y; __utmt=1; dbcl2="178675845:8b8wWwTCQOQ"; ck=LDEV; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1526649626%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _vwo_uuid_v2=D13A1E2CA9F099C5F03963125D6884832|48861d9c1aa1c9357e7778210a464d33; _pk_id.100001.4cf6=6d19214551336a9b.1526515966.3.1526649629.1526564585.; _pk_ses.100001.4cf6=*; __utma=30149280.844991547.1526515961.1526644071.1526649613.4; __utmb=30149280.3.10.1526649613; __utmc=30149280; __utmz=30149280.1526649613.4.4.utmcsr=accounts.douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/safety/unlock_sms/resetpassword; __utmv=30149280.17867; __utma=223695111.921000792.1526515966.1526564577.1526649626.3; __utmb=223695111.0.10.1526649626; __utmc=223695111; __utmz=223695111.1526649626.3.3.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; push_noty_num=0; push_doumail_num=0'
]

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
 * 分类起始下标
 */
let tagStartIndex = 0;
/**
 * 分类结束下标
 */
const tagEndIndex = tags.length - 1;
/**
 * 单个分类下，获取列表大小限制
 */
const pageLimit = 100;
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
const sorts = ['recommend', 'time', 'rank'];

/**
 * 随机headers
 */
//let radomHeader = getRadomHeaders();

/**
 * 请求延时：毫秒
 */
const delayTime = 500;

/**
 * 每100次更换一次ip proxy
 */
const times = 100;

/**
 * 可用的代理ip
 */
const proxys = [
    'http://39.135.35.19:80',
    'http://118.114.77.47:8080'
]
/**
 * 当前的proxy index
 */
let currentProxysIndex = 0;

/**
 * 当前使用的代理
 */
let currentProxy = getNextProxy();

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
    const errorMovieIdArray = [];
    for(let i = pageStartIndex; i <= pageEndIndex; i++){
        const pageStart = i * pageLimit;
        const subjects = await getDoubanList(i, tagIndex, sort);
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
        // const resData = await HttpsUtil.getAsync({
        //     hostname: 'movie.douban.com',
        //     path: `/subject/${doubanMovieId}/?from=showing`,
        //     headers: radomHeader
        // }, 'utf-8');

        const {statusCode, body} = await request({
            method: 'GET',
            url: `https://movie.douban.com/subject/${doubanMovieId}/?from=showing`,
            resolveWithFullResponse: true,
            proxy: currentProxy,
            headers: getRadomHeaders()
        })
        
        //延时，免得被豆瓣封ip
        await PublicFunction.delay(delayTime);
        //const {statusCode} = resData;
        if(statusCode === 200){
            httpsSuccessCount++;
            const doubanDocument = $.load(body);
            doubanMovie = doubanMovieService.getDoubanDetail(doubanDocument);
            //存放豆瓣电影id
            doubanMovie.doubanMovieId = doubanMovieId;
            const saveResult = await doubanMovieService.saveOrUpdateDoubanMovie(doubanMovie);
            parseSuccessCount++;
            console.log(`第${parseSuccessCount}部电影 “${saveResult.doubanMovieId}——${saveResult.name}” 解析成功`);
            //100次请求换一次proxy
            if(httpsSuccessCount % times === 0){
                currentProxy = getNextProxy();
            }
        }else{
            console.log(`/***** 第${parseIndex}部电影 “${doubanMovieId}——${doubanMovieTitle}” 解析失败, statusCode：${statusCode} *****/`);
            logger.error(`第${parseIndex}部电影 “${doubanMovieId}——${doubanMovieTitle}” 解析失败, statusCode：${statusCode} `, resData.data);
        }
    }
}

async function getDoubanList(pageIndex: number, tagIndex: number, sort: string){
    const pageStart = pageIndex * pageLimit;
    let subjects = [];
    const maxTryTimes = 10;
    for(let tryStartIndex = 1; tryStartIndex <= maxTryTimes; tryStartIndex++){
        try {                    
            //获取列表数据
            console.log(`获取“${tags[tagIndex]}-${sort}”的列表数据 ${pageStart + 1} 到 ${pageStart + pageLimit} 条`);
            // const resData = await HttpsUtil.getAsync({
            //     hostname: 'movie.douban.com',
            //     path: `/j/search_subjects?type=movie&tag=${encodeURIComponent(tags[tagIndex])}&sort=${sort}&page_limit=${pageLimit}&page_start=${pageStart}`,
            //     headers: radomHeader
            // }, 'utf-8'); 
            const {statusCode, body} = await request({
                method: 'GET',
                url: `https://movie.douban.com/j/search_subjects?type=movie&tag=${encodeURIComponent(tags[tagIndex])}&sort=${sort}&page_limit=${pageLimit}&page_start=${pageStart}`,
                resolveWithFullResponse: true,
                proxy: currentProxy,
                headers: getRadomHeaders()
            })
            //延时，免得被豆瓣封ip
            await PublicFunction.delay(delayTime);
            if(statusCode === 200){
                httpsSuccessCount++;
                subjects = JSON.parse(body);
                //100次请求换一次proxy
                if(httpsSuccessCount % times === 0){
                    currentProxy = getNextProxy();
                }
                break;
            }
        } catch (error) {
            console.log(`/***** 请求“${tags[tagIndex]}”的列表数据 ${pageStart + 1} 到 ${pageStart + pageLimit} 条出错 *****/`);
            logger.error(`请求“${tags[tagIndex]}”的列表数据 ${pageStart + 1} 到 ${pageStart + pageLimit} 条出错`, error);
            if(tryStartIndex === maxTryTimes){
                return Promise.reject(new Error(`尝试了${maxTryTimes}次，仍然失败`));
            }
            currentProxy = getNextProxy();
        }
    }
    return subjects;
}

/**
 * 获取随机cookie
 */
function getRadomCookie() {
    const bid = [];
    for(let i = 0; i < 4; i++){
        bid.push(Math.ceil(Math.random() * 9));
    }

    return `bid=${bid.join()}; ll="${bid.join()}68"; _vwo_uuid_v2=268A153A3B0C643D147E31481E0895A0|0a1395ad6b587e425cf1f4bd99fad91b; ct=y; __utmc=30149280; __utma=30149280.1991939520.1484715813.1526445050.1526450039.22; __utmz=30149280.1526450039.22.19.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _ga=GA1.2.1991939520.1484715813; _gid=GA1.2.25358410.1526450489; dbcl2="178675845:ANpI/2A51zQ"; ck=nJu3; push_noty_num=0; push_doumail_num=0; __utmv=30149280.17867; __utmb=30149280.7.10.1526450039; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1526450505%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _pk_ses.100001.4cf6=*; __utma=223695111.782172476.1501562695.1526438955.1526450505.11; __utmb=223695111.0.10.1526450505; __utmc=223695111; __utmz=223695111.1526450505.11.6.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_id.100001.4cf6=2b9398a388e83bef.1501562694.11.1526450517.1526440137.`
}

/**
 * 获取随机的headers
 */
function getRadomHeaders(){
    //const radomCookieIndex = Math.floor(Math.random() * doubanCookies.length );
    const radomUserAgentIndex = Math.floor(Math.random() * doubanCookies.length );
    const headers = {
        'User-Agent': userAgents[radomUserAgentIndex]
        //'Cookie': doubanCookies[5]
    }
    return headers;
}

/**
 * 更换代理
 */
function getNextProxy(){
    currentProxysIndex++;
    return proxys[currentProxysIndex % proxys.length];
}

/**
 * 豆瓣爬虫
 */
export default class doubanSpider{
    /**
     * 开始豆瓣爬虫
     */
    static async start(){
        let lastTagIndex = 0;
        try {
            console.log('/***** 豆瓣电影爬取服务开启 *****/')
            const latestSpiderInfos = await SpiderInfo.find().limit(1).sort({'meta.updateAt': 'desc'}).exec();
            if(latestSpiderInfos && latestSpiderInfos.length > 0){
                tagStartIndex = latestSpiderInfos[0].tagIndex;
                console.log(`上次在 “${tags[tagStartIndex]}” 结束，因此在此位置开始`);
            }
            //逐个分类进行查询
            for(let i = tagStartIndex; i <= tagEndIndex; i++){
                lastTagIndex = i;
                for(let j = 0; j < sorts.length; j++){                
                    await startGemovieFromDouban(i, sorts[j]);
                }
            }        
            console.log('/***** 所有分类爬取完毕 *****/');
        } catch (error) {
            const spiderInfo = new SpiderInfo({
                tagIndex: lastTagIndex,
                httpsSuccessCount: httpsSuccessCount,
                parseSuccessCount: parseSuccessCount
            });
            await spiderInfo.save();
            console.log('/***** 豆瓣电影爬取服务出错，已停止 *****/', error)
            console.log(`请求成功数为：${httpsSuccessCount}`)
            logger.error(error);
            logger.error(`请求成功数为：${httpsSuccessCount}`);
        }
    }
}
