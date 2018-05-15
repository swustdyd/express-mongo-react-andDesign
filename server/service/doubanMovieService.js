import $ from 'cheerio'
import DoubanMovie from '../models/doubanMovie'
import BusinessException from '../common/businessException';
import BaseService from './baseService'
import { DoubanMovieType } from '../common/type';
import HttpsUtil from '../common/httpsUtil'

export default class DoubanMovieServie extends BaseService{
    /**
     * 保存豆瓣电影信息
     * @param {*} doubanMovie 
     */
    saveDoubanMovie(doubanMovie: DoubanMovieType) : Promise<{success: boolean, result: DoubanMovieType}>{
        return new Promise((resolve, reject) => {
            doubanMovie = new DoubanMovie(doubanMovie);
            doubanMovie.save((err, movie) => {
                if(err){
                    reject(err);
                }
                resolve({success: true, result: movie});
            })
        })
    }

    /**
     * 根据id，解析豆瓣电影
     * @param {*} doubanMovieId 豆瓣电影id
     * @param {*} index 解析的顺序号，只会输出到console
     */
    async parseAndSaveDoubanMovie(doubanMovieId: string, index = 0){
        const resData = await HttpsUtil.getAsync(`https://movie.douban.com/subject/${doubanMovieId}/?from=showing`, 'utf-8');
        const doubanDocument = $.load(resData.data);
        const doubanMovie = this._getDoubanDetail(doubanDocument);
        //豆瓣电影id
        doubanMovie.doubanMovieId = doubanMovieId;
        const serviceRes = await this.saveDoubanMovie(doubanMovie);
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
                    detail.types = typeArray;
                    break;
                case '制片国家/地区:':
                    detail.countries = item.next.data.trim().split('/').map((item) => {return item.trim();});
                    break;
                case '语言:':
                    detail.languages = item.next.data.trim().split('/').map((item) => {return item.trim();});
                    break;
                case '上映日期:':
                    const $releaseDate = doubanDetaiDocument('#info').children('span[property="v:initialReleaseDate"]');
                    const releaseDateArray = [];
                    $releaseDate.map((i, item) => {
                        releaseDateArray.push($(item).text());
                    });
                    detail.pubdates = releaseDateArray;
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
}