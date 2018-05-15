import mongoose from 'mongoose'
import DoubanMovieService from './service/doubanMovieService'
import HttpsUtil from './common/httpsUtil'
import logger from './common/logger'
import PublicFunction from './common/publicFunc'
import BaseConfig from '../baseConfig'

mongoose.connect(BaseConfig.dbConnectString);
const doubanMovieService = new DoubanMovieService();

//热门  最新  经典  可播放  豆瓣高分  冷门佳片  华语  欧美  韩国  日本  动作 喜剧  爱情  科幻  悬疑  恐怖  动画
const tagStr = '欧美';
const tag = encodeURIComponent(tagStr);
//热度：recommend, 时间：time, 评论：rank
const sort = 'recommend';

process.on('uncaughtException', (err) => {
    console.log('uncaughtException', err);
    logger.error('uncaughtException', err);
});

process.nextTick(async () => {    
    console.log(`豆瓣电影爬取服务开启，tag：${tagStr}，sort：${sort}`)
    try {    
        await startGemovieFromDouban(tag, sort);
    } catch (error) {
        await mongoose.disconnect();
        console.log('豆瓣电影爬取服务出错', error)
        logger.error(error);
    }
    await mongoose.disconnect();
})

/**
 * 开始从豆瓣网获取movie
 * @param {*} tag 分类信息
 * @param {*} sort 排序
 */
async function startGemovieFromDouban(tag = encodeURIComponent('热门'), sort = 'recommend'){
    try {
        //每页大小
        const pageLimit = 20;        
        //先扒200条试试水
        const errorMovieIdArray = [];
        for(let i = 10; i < 20; i++){
            const pageStart = i * pageLimit;
            //获取列表数据
            console.log(`获取列表数据 ${pageStart + 1} 到 ${pageStart + pageLimit} 条`);
            const resData = await HttpsUtil.getAsync(`https://movie.douban.com/j/search_subjects?type=movie&tag=${tag}&sort=${sort}&page_limit=${pageLimit}&page_start=${pageStart}`, 'utf-8');
            const {subjects} = JSON.parse(resData.data);
            if(subjects.length < 1){
                console.log('已无更多的movie');
                break;
            }
            for(let j = 0; j < subjects.length; j++){
                try{                    
                    await doubanMovieService.parseAndSaveDoubanMovie(subjects[j].id, i * pageLimit + j + 1);
                    //延时2.5s，免得被豆瓣封ip
                    await PublicFunction.delay(2500);
                }catch(e){
                    logger.error(`电影 “${subjects[j].id}——${subjects[j].title}” 爬取出错 `, e);
                    errorMovieIdArray.push(subjects[j].id);
                }
            }                
            
            // console.log(`start parse movie ${pageStart} to ${pageStart + pageLimit}`);
            // const promiseArray = []
            // //添加到promise队列中，等候执行
            // subjects.forEach((item, index) => {
            //     promiseArray.push(this._parseAndSaveDoubanMovie(item.id, index))
            // })
            // //并行执行20请求，等待所有20请求执行后，返回数据
            // await Promise.all(promiseArray);
            // console.log(`movie ${pageStart} to ${pageStart + pageLimit} has parse complete`);
        }
        if(errorMovieIdArray.length < 1){
            console.log('爬取完毕');
        }else{
            logger.error(`爬取过程中出错，出错的电影id列表为：${JSON.stringify(errorMovieIdArray)}`);
        }
        
    } catch (error) {
        console.log(error);
        logger.error('`爬取过程中，获取列表数据出错，爬取服务已停止', error);
    }
}