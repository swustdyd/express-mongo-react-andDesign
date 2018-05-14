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
    testJS(req, res, next){
        try {
            console.log(`constructor name is '${testController.constructor.name}'`);
            for(const key in testController){
                console.log(key)
            }
            res.json(i);
        } catch (error) {
            next(error);
        }
    }

    async testCheerio(req, res, next){
        try {
            //先扒200条试试水
            const pageLimit = 20
            for(let i = 0; i < 10; i++){
                const pageStart = i * pageLimit;
                //获取列表数据
                const resData = await HttpsUtil.getAsync(`https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=${pageLimit}&page_start=${pageStart}`, 'utf-8');
                console.log(resData, pageStart, pageLimit);
                const {subjects} = JSON.parse(resData.data);
                
                console.log(`start parse movie ${pageStart} to ${pageStart + pageLimit}`);
                const promiseArray = []
                //添加到promise队列中，等候执行
                subjects.forEach((item, index) => {
                    promiseArray.push(this._parseAndSaveDoubanMovie(item.id, index))
                })
                //并行执行20请求，等待所有20请求执行后，返回数据
                await Promise.all(promiseArray);
                console.log(`movie ${pageStart} to ${pageStart + pageLimit} has parse complete`);
            }
            console.log('all movie has parse compelte');            
            res.send('all movie has parse compelte');
        } catch (error) {
            next(error);
        }
    }

    async _parseAndSaveDoubanMovie(doubanMovieId, index){
        const resData = await HttpsUtil.getAsync(`https://movie.douban.com/subject/${doubanMovieId}/?from=showing`, 'utf-8');
        const doubanDocument = $.load(resData.data);
        const doubanMovie = this._getDoubanDetail(doubanDocument);
        doubanMovie.saveIndex = index;
        const serviceRes = await this._doubanMovieService.saveDoubanMovie(doubanMovie);
        console.log(`movie ${index} '${serviceRes.result.name}' parse complete`);
        return serviceRes.result;
    }

    _getDoubanDetail(doubanDetaiDocument: CheerioStatic){
        const detail = {};
        //电影名称
        detail.name = doubanDetaiDocument('#content').find('span[property="v:itemreviewed"]').text();
        //海报信息
        detail.mainpic = {
            href: doubanDetaiDocument('#mainpic').find('img').attr('src'),
            title: doubanDetaiDocument('#mainpic').find('img').attr('title'),
            alt: doubanDetaiDocument('#mainpic').find('img').attr('alt')
        }

        //解析：导演、编剧、主演信息
        const $firstChildren = doubanDetaiDocument('#info').children('span');
        const items = []
        $firstChildren.map((i: number, item: Element) => {
            const $item = $(item);
            const $pl = $item.children('.pl');
            const $attrs = $item.children('.attrs');
            if($pl && $attrs.length > 0){
                const attrs = [];
                const $childrenOf$Attrs = $attrs.children('*');
                $childrenOf$Attrs.map((i: number, item: Element) => {
                    attrs.push($(item).text());
                })
                items.push({
                    name: $pl.text(),
                    value: attrs
                });
            }
        });        

        //解析：类型、官方网站、制片国家/地区、语言、上映日期、片长、又名、IMDb链接
        const $otherChildren = doubanDetaiDocument('#info').children('.pl');
        $otherChildren.map((i, item) => {
            const $item = $(item);
            const plText = $item.text();
            const data = {
                name: plText
            };
            switch(plText){
                case '类型:':
                    const $type = doubanDetaiDocument('#info').children('span[property="v:genre"]');
                    const typeArray = [];
                    $type.map((i, item) => {
                        typeArray.push($(item).text());
                    });
                    data.value = typeArray;
                    break;
                case '上映日期:':
                    const $releaseDate = doubanDetaiDocument('#info').children('span[property="v:initialReleaseDate"]');
                    const releaseDateArray = [];
                    $releaseDate.map((i, item) => {
                        releaseDateArray.push($(item).text());
                    });
                    data.value = releaseDateArray;
                    break;
                case 'IMDb链接:':
                    data.value = $item.next().attr('href');
                    break;
                default:
                    if(item.next.type === 'text' && item.next.data && item.next.data.trim()){
                        data.value = item.next.data.trim();
                    }else{
                        data.value = $item.next().text();
                    }                    
                    break;
            }
            items.push(data);
        });

        //简介
        detail.summary = doubanDetaiDocument('#link-report').find('span[property="v:summary"]').text().trim();

        detail.infos = items;
        return detail;
    }
}