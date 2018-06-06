import $ from 'cheerio'
//import DoubanMovie from '../models/doubanMovie'
const DoubanMovie = {};
import MovieType from '../models/movieType'
import BusinessException from '../common/businessException';
import BaseService from './baseService'
import { DoubanMovieType, MultipleReturnType, PageReturnType, DoubanMovieAndTagType, QueryOptionsType } from '../common/type';
import HttpsUtil from '../common/httpsUtil'
import { QueryDefaultOptions } from '../common/commonSetting';

export default class DoubanMovieServie extends BaseService{
    /**
     * 保存或者更新豆瓣电影信息
     * @param {*} doubanMovie 
     */
    async saveOrUpdateDoubanMovie(doubanMovie: DoubanMovieType) : Promise<{success: boolean, result: DoubanMovieType}>{
        if(doubanMovie._id){
            //更新
            const origin = await this.getDoubanMoviesBybjectid(doubanMovie._id);
            Object.assign(origin, doubanMovie);
            origin.meta.updateAt = Date.now();
            return await origin.save();
        }else{
            //新增
            doubanMovie = new DoubanMovie(doubanMovie);
            doubanMovie.meta.createAt = doubanMovie.meta.updateAt = Date.now();
            return await doubanMovie.save();
        }
    }

    /**
     * 根据豆瓣电影id获取豆瓣电影
     * @param {*} doubanMovieId 豆瓣电影id
     */
    async getDoubanMoviesByDoubanid(doubanMovieId: string) : Promise<DoubanMovieType>{
        return await DoubanMovie.findOne({doubanMovieId});
    }

    /**
     * 根据objectid获取豆瓣电影
     * @param {*} objectid 豆瓣电影id
     */
    async getDoubanMoviesBybjectid(objectid: string) : Promise<DoubanMovieType>{
        return await DoubanMovie.findOne({_id: objectid});
    }

    /**
     * 保存豆瓣电影的分类信息
     * @param {*} doubanMovieAndTag 
     */
    async saveDoubanMovieAndTag(doubanMovieAndTag: DoubanMovieAndTagType) : Promise<DoubanMovieAndTagType>{
        doubanMovieAndTag = new DoubanMovieAndTag(doubanMovieAndTag);
        return await doubanMovieAndTag.save()
    }

    /**
     * 保存电影的划分类型
     * @param {*} movieType
     */
    async saveMovieAndType(movieType){
        movieType = new MovieType(movieType);
        return await movieType.save()
    }

    /**
     * 获取豆瓣电影信息
     * @param {*} pageIndex 起始页
     * @param {*} pageSize 每页大小
     */
    async getDoubanMovies(pageIndex: number = QueryDefaultOptions.pageIndex, pageSize: number = QueryDefaultOptions.pageSize) : PageReturnType{
        const total = await DoubanMovie.count();
        const result = await DoubanMovie.find().skip(pageIndex * pageSize).limit(pageSize).exec();
        return {
            success: true,
            pageIndex,
            pageSize,
            total,
            result
        };
    }

    /**
     * 查询豆瓣电影
     * @param {*} option 
     */
    async getDoubanMoviesAndTagByOption(option: QueryOptionsType){
        option = Object.assign({}, QueryDefaultOptions, option);
        const total = await DoubanMovieAndTag.count(option.condition);
        const result = await DoubanMovieAndTag.find(option.condition)
            .skip(option.pageIndex * option.pageSize)
            .limit(option.pageSize)
            .exec();
        return {
            success: true,
            pageIndex: option.pageIndex,
            pageSize: option.pageSize,
            total,
            result
        }
    }

    /**
     * 查询豆瓣电影类型划分， option.condition={typeKey: '', typeValue: '', ...}
     * @param {*} option 
     */
    async getMovieTypeByOption(option: QueryOptionsType){
        option = Object.assign({}, QueryDefaultOptions, option);
        const total = await MovieType.count(option.condition);
        const result = await MovieType.find(option.condition)
            .skip(option.pageIndex * option.pageSize)
            .limit(option.pageSize)
            .exec();
        return {
            success: true,
            pageIndex: option.pageIndex,
            pageSize: option.pageSize,
            total,
            result
        }
    }

    /**
     * 根据id，解析豆瓣电影
     * @param {*} doubanMovieId 豆瓣电影id
     * @param {*} index 解析的顺序号，只会输出到console
     */
    // async parseAndSaveDoubanMovie(doubanMovieId: string, index = 0){
    //     const resData = await HttpsUtil.getAsync(`https://movie.douban.com/subject/${doubanMovieId}/?from=showing`, 'utf-8');
    //     const doubanDocument = $.load(resData.data);
    //     const doubanMovie = this.getDoubanDetail(doubanDocument);
    //     //豆瓣电影id
    //     doubanMovie.doubanMovieId = doubanMovieId;
    //     const serviceRes = await this.saveDoubanMovie(doubanMovie);
    //     console.log(`第${index}部电影 “${doubanMovieId}——${serviceRes.result.name}” 解析成功`);
    //     return serviceRes.result;
    // }


    /**
     * 解析豆瓣电影网页
     */
    getDoubanDetail(doubanDetaiDocument: CheerioStatic){
        const detail = {};
        //电影名称
        detail.name = doubanDetaiDocument('#content').find('span[property="v:itemreviewed"]').text();
        //海报信息
        detail.mainpic = {
            href: doubanDetaiDocument('#mainpic').find('img').attr('src'),
            title: doubanDetaiDocument('#mainpic').find('img').attr('title'),
            alt: doubanDetaiDocument('#mainpic').find('img').attr('alt')
        }
        //年代
        const yearStr = doubanDetaiDocument('#content').find('h1>.year').text();
        detail.year = yearStr.match(/\d+/) ? yearStr.match(/\d+/)[0] : '';
        //评分
        detail.average = doubanDetaiDocument('#interest_sectl').find('strong[property="v:average"]').text();

        //解析：导演、编剧、主演信息
        const $firstChildren = doubanDetaiDocument('#info').children('span');
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
                const plText = $pl.text();
                switch(plText){
                    case '导演':
                        detail.directors = attrs;
                        break;
                    case '编剧':
                        detail.writers = attrs;
                        break;
                    case '主演':
                        detail.actors = attrs;
                        break;
                    default:
                        break;
                }
            }
        });        

        //解析：类型、官方网站、制片国家/地区、语言、上映日期、片长、又名、IMDb链接
        const $otherChildren = doubanDetaiDocument('#info').children('.pl');
        $otherChildren.map((i, item) => {
            const $item = $(item);
            const plText = $item.text();
            switch(plText){
                case '类型:':
                    const $type = doubanDetaiDocument('#info').children('span[property="v:genre"]');
                    const typeArray = [];
                    $type.map((i, item) => {
                        typeArray.push($(item).text());
                    });
                    detail.types = typeArray;
                    break;
                case '官方网站:':
                    detail.officialWebsite = $item.next().attr('href');
                    break;
                case '制片国家/地区:':
                    detail.countries = item.next.data.trim().split('/').map((item) => {return item.trim();});
                    break;
                case '语言:':
                    detail.languages = item.next.data.trim().split('/').map((item) => {return item.trim();});
                    break;
                case '首播'://与“上映日期”是相同的字段
                case '上映日期:':
                    const $releaseDate = doubanDetaiDocument('#info').children('span[property="v:initialReleaseDate"]');
                    const releaseDateArray = [];
                    $releaseDate.map((i, item) => {
                        releaseDateArray.push($(item).text());
                    });
                    detail.pubdates = releaseDateArray;
                    break;
                case '季数:':
                    detail.season = doubanDetaiDocument('#season').find('option:selected').text();
                    break;
                case '集数:':
                    detail.count = item.next.data.trim();
                    break;
                case '单集片长:':
                    detail.durations = item.next.data.trim();
                    break;
                case '片长:':
                    detail.durations = doubanDetaiDocument('#info').children('span[property="v:runtime"]').text();
                    break;
                case '又名:':
                    detail.aka = item.next.data.trim().split('/').map((item) => {return item.trim();});
                    break;
                case 'IMDb链接:':
                    detail.IMBdLink = $item.next().attr('href');
                    break;
                default:                  
                    break;
            }
        });

        //简介
        detail.summary = doubanDetaiDocument('#link-report').find('span[property="v:summary"]').text().trim();

        detail.infos = undefined;
        return detail;
    }

    /**
     * 获取类型(year)的分组信息
     * @param {*} match
     */
    async getGroupInfoByYear(match: {}){
        return await DoubanMovie.aggregate([
            {$match: match},
            {$group: {_id: '$year', count: { $sum: 1}}}
        ]).exec();
    }

    /**
     * 获取类型(types)的分组信息
     * @param {*} match
     */
    async getGroupInfoByTypes(match: {}){
        return await MovieType.aggregate([
            {$match: {typeKey: 'types', ...match}},
            {$group: {_id: '$typeValue', count: { $sum: 1}}}
        ]).exec();
    }

    /**
     * 获取类型(languages)的分组信息
     * @param {*} match
     */
    async getGroupInfoByLanguages(match: {}){
        return await MovieType.aggregate([
            {$match: {typeKey: 'languages', ...match}},
            {$group: {_id: '$typeValue', count: { $sum: 1}}}
        ]).exec();
    }

    /**
     * 获取类型(countries)的分组信息
     * @param {*} match
     */
    async getGroupInfoByCountries(match: {}){
        return await MovieType.aggregate([
            {$match: {typeKey: 'countries', ...match}},
            {$group: {_id: '$typeValue', count: { $sum: 1}}}
        ]).exec();
    }
}