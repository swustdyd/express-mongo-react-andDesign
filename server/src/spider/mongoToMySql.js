import mongoose from 'mongoose'
import moment from 'moment'
import DoubanMovieService from '../service/doubanMovieService'
import logger from '../common/logger'
import BaseConfig from '../../../baseConfig'
import Aka from '../models/aka'
import AkaWithOther from '../models/akaWithOther'
import Artist from '../models/artist'
import ArtistJob from '../models/artistJob'
import Country from '../models/country'
import CountryMovie from '../models/countryMovie'
import DoubanMovie from '../models/doubanMovie'
import Job from '../models/job'
import Language from '../models/language'
import LanguageMovie from '../models/languageMovie'
import MovieType from '../models/movieType'
import PublishDate from '../models/publishDate'
import Type from '../models/type'
import MongoDoubanMovie from './models/doubanMovie'
import {db} from '../db'
const mysqldb = db;

mongoose.connect(BaseConfig.dbConnectString);

doUpdate();

async function doUpdate() {
    try {
        const total = await MongoDoubanMovie.count();
        //const total = 20;
        const pageSize = 20;
        const pageEndIndex = Math.ceil(total / pageSize);
        console.log(`电影总数为：${total}, pageEndIndex: ${pageEndIndex}, pageSize: ${pageSize}`);
        for(let pageIndex = 0; pageIndex < pageEndIndex; pageIndex++){
            console.log(`解析数据：${pageIndex * pageSize + 1} 到 ${pageIndex * pageSize + pageSize} 条`);
            const result = await MongoDoubanMovie.find().skip(pageIndex * pageSize).limit(pageSize).exec();            
            const promiseList = [];
            for(let i = 0; i < result.length; i++){
                const doubanMovie = result[i];
                //promiseList.push(updateOne(doubanMovie));
                await updateOne(doubanMovie)
            }
            //await Promise.all(promiseList);

        }
        console.log('解析成功');
        process.exit();
    } catch (error) {
        console.log(error);
        logger.error(error);
        process.exit();
    }
}

async function updateOne(mongoDoubanMovie){
    return await mysqldb.transaction().then(async (t) => {        
        try {        
            let doubanMovie = await DoubanMovie.findOne({
                where: {
                    doubanMovieId: mongoDoubanMovie.doubanMovieId
                },
                transaction: t
            })
            //不存在该电影，进行数据解析
            if(!doubanMovie){
                //新增该电影到mysql
                doubanMovie = await DoubanMovie.create({
                    doubanMovieId: mongoDoubanMovie.doubanMovieId,
                    name: mongoDoubanMovie.name,
                    year: mongoDoubanMovie.year,
                    average: mongoDoubanMovie.average,
                    picture: mongoDoubanMovie.mainpic ? mongoDoubanMovie.mainpic.href : '',
                    summary: mongoDoubanMovie.summary,
                    durations: mongoDoubanMovie.durations,
                    IMBdLink: mongoDoubanMovie.IMBdLink,
                    officialWebsite: mongoDoubanMovie.officialWebsite,
                    season: mongoDoubanMovie.season,
                    count: mongoDoubanMovie.count
                }, {transaction: t})
                await insertAka(mongoDoubanMovie, t, doubanMovie);
                await insertArtist(mongoDoubanMovie, t, doubanMovie);
                await insertCountry(mongoDoubanMovie, t, doubanMovie);
                await insertLanguage(mongoDoubanMovie, t, doubanMovie);
                await insertPubdate(mongoDoubanMovie, t, doubanMovie);
                await insertType(mongoDoubanMovie, t, doubanMovie);
            }else{
                console.log(`电影：${doubanMovie.name} 已存在`);
            }
            t.commit();
        } catch (error) {        
            t.rollback();
            console.log(error);
            logger.error(error);
        }
    })    
}

async function insertAka(mongoDoubanMovie, t, doubanMovie){
    //别名
    if(mongoDoubanMovie.aka){
        for(let i = 0; i < mongoDoubanMovie.aka.length; i++){
            const item = mongoDoubanMovie.aka[i];
            let aka = await Aka.findOne({
                where: {
                    akaName: item
                }, 
                transaction: t
            });
            if(!aka){
                aka = await Aka.create({akaName: item}, {transaction: t});
            }
            await AkaWithOther.create({akaId: aka.akaId, otherId: doubanMovie.movieId}, {transaction: t});
        }
    }    
}

async function insertArtist(mongoDoubanMovie, t, doubanMovie){
    //演员
    if(mongoDoubanMovie.actors){
        for(let i = 0; i < mongoDoubanMovie.actors.length; i++){
            const item = mongoDoubanMovie.actors[i];
            let actor = await Artist.findOne({
                where: {
                    name: item
                }, 
                transaction: t
            });
            if(!actor){
                actor = await Artist.create({name: item}, {transaction: t});
            }
        }
    }
}

async function insertCountry(mongoDoubanMovie, t, doubanMovie){
    //国家/出版地
    if(mongoDoubanMovie.countries){
        for(let i = 0; i < mongoDoubanMovie.countries.length; i++){
            const item = mongoDoubanMovie.countries[i];
            let country = await Country.findOne({
                where: {
                    countryName: item
                }, 
                transaction: t
            });
            if(!country){
                country = await Country.create({countryName: item}, {transaction: t});
            }
            await CountryMovie.create({countryId: country.countryId, movieId: doubanMovie.movieId}, {transaction: t});
        }
    }
    
}

async function insertLanguage(mongoDoubanMovie, t, doubanMovie){
    //语言
    if(mongoDoubanMovie.languages){
        for(let i = 0; i < mongoDoubanMovie.languages.length; i++){
            const item = mongoDoubanMovie.languages[i];
            let language = await Language.findOne({
                where: {
                    languageName: item
                }, 
                transaction: t
            });
            if(!language){
                language = await Language.create({languageName: item}, {transaction: t});
            }
            await LanguageMovie.create({languageId: language.languageId, movieId: doubanMovie.movieId}, {transaction: t});
        }
    }
}

async function insertType(mongoDoubanMovie, t, doubanMovie){
    //类型
    if(mongoDoubanMovie.types){
        for(let i = 0; i < mongoDoubanMovie.types.length; i++){
            const item = mongoDoubanMovie.types[i];
            let type = await Type.findOne({
                where: {
                    typeName: item
                }, 
                transaction: t
            });
            if(!type){
                type = await Type.create({typeName: item}, {transaction: t});
                // const now = Date.now();
                // await db.query('insert into type(typeName,createAt,updateAt) values (:item, :createAt, :updateAt) on duplicate key update typeName = :item', {
                //     replacements:{
                //         item: item,
                //         createAt: moment(now).format(BaseConfig.dateFormatString),
                //         updateAt: moment(now).format(BaseConfig.dateFormatString)
                //     },
                //     transaction: t
                // });
            }
            await MovieType.create({movieId: doubanMovie.movieId, typeId: type.typeId}, {transaction: t});
        }
    }
}

async function insertPubdate(mongoDoubanMovie, t, doubanMovie){
    //上映日期
    if(mongoDoubanMovie.pubdates){
        for(let i = 0; i < mongoDoubanMovie.pubdates.length; i++){
            const item = mongoDoubanMovie.pubdates[i];
            await PublishDate.create({movieId: doubanMovie.movieId, publishDate: item}, {transaction: t});
        }
    }
}
