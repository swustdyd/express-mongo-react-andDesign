import mongoose from 'mongoose'
import moment from 'moment'
import logger from '../common/logger'
import BaseConfig from '../../../baseConfig'
import Aka from '../models/aka'
import AkaWithOther from '../models/akaWithOther'
import Artist from '../models/artist'
import ArtistJob from '../models/artistJob'
import ArtistMovie from '../models/artistMovie'
import Country from '../models/country'
import CountryMovie from '../models/countryMovie'
import Movie from '../models/movie'
import Job from '../models/job'
import Language from '../models/language'
import LanguageMovie from '../models/languageMovie'
import MovieType from '../models/movieType'
import PublishDate from '../models/publishDate'
import Type from '../models/type'
import MongoDoubanMovie from './models/doubanMovie'
import {db} from '../db'
import RedisLock, {LockCode} from './redisLock'
const mysqldb = db;

mongoose.connect(BaseConfig.dbConnectString);

doUpdate();

async function doUpdate() {
    try {
        const total = await MongoDoubanMovie.count();
        const pageSize = 100;
        const pageEndIndex = Math.ceil(total / pageSize);
        console.log(`电影总数为：${total}, pageEndIndex: ${pageEndIndex}, pageSize: ${pageSize}`);
        for(let pageIndex = 0; pageIndex < pageEndIndex; pageIndex++){
            console.log(`解析数据：${pageIndex * pageSize + 1} 到 ${pageIndex * pageSize + pageSize} 条`);
            const result = await MongoDoubanMovie.find().skip(pageIndex * pageSize).limit(pageSize).exec();            
            const promiseList = [];
            for(let i = 0; i < result.length; i++){
                const doubanMovie = result[i];
                promiseList.push(updateOne(doubanMovie));
                //await updateOne(doubanMovie)
            }
            await Promise.all(promiseList);

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
            let doubanMovie = await Movie.findOne({
                where: {
                    doubanMovieId: mongoDoubanMovie.doubanMovieId
                },
                transaction: t
            })
            //不存在该电影，进行数据解析
            if(!doubanMovie){
                //新增该电影到mysql
                doubanMovie = await Movie.create({
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
                await Promise.all([
                    insertAka(mongoDoubanMovie, t, doubanMovie),
                    insertAllArtist(mongoDoubanMovie, t, doubanMovie),
                    insertCountry(mongoDoubanMovie, t, doubanMovie),
                    insertLanguage(mongoDoubanMovie, t, doubanMovie),
                    insertPubdate(mongoDoubanMovie, t, doubanMovie),
                    insertType(mongoDoubanMovie, t, doubanMovie)
                ])
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
            const key = 'aka', uuid = '123456789';
            while(true){
                const result = await RedisLock.lock(key, uuid);
                if(result.success){                                            
                    let aka = await Aka.findOne({
                        where: {
                            akaName: item
                        }
                    });
                    if(!aka){
                        aka = await Aka.create({akaName: item});
                    }
                    await RedisLock.unlock(key, uuid)
                    await AkaWithOther.create({akaId: aka.akaId, otherId: doubanMovie.movieId}, {transaction: t});
                }
                if(result.code !== LockCode.REDIS_LOCK_EXIST){
                    break;
                }
            }
        }
    }    
}

async function insertAllArtist(mongoDoubanMovie, t, doubanMovie){
    await Promise.all([
        insertActor(mongoDoubanMovie, t, doubanMovie),
        insertWriter(mongoDoubanMovie, t, doubanMovie),
        insertDirector(mongoDoubanMovie, t, doubanMovie)
    ])
}

async function insertActor(mongoDoubanMovie, t, doubanMovie){
    const key = 'actor', uuid = '123456789';
    while(true){
        const result = await RedisLock.lock(key, uuid);
        if(result.success){
            //演员
            let actorJob = await Job.findOne({
                where: {
                    jobENName: 'actor'
                }
            })
            if(!actorJob){
                logger.info(key, result);
                actorJob = await Job.create({jobName: '演员', jobENName: 'actor'});
            }
            await RedisLock.unlock(key, uuid)
            if(mongoDoubanMovie.actors){
                for(let i = 0; i < mongoDoubanMovie.actors.length; i++){
                    const item = mongoDoubanMovie.actors[i];
                    await insertOneArtist(mongoDoubanMovie, t, doubanMovie, item, actorJob.jobId)                   
                }
            }    
        }
        if(result.code !== LockCode.REDIS_LOCK_EXIST){
            break;
        }
    }   
}
async function insertWriter(mongoDoubanMovie, t, doubanMovie){
    const key = 'writer', uuid = '123456789';
    while(true){
        const result = await RedisLock.lock(key, uuid);
        if(result.success){                       
            //编剧
            let writerJob = await Job.findOne({
                where: {
                    jobENName: 'writer'
                }
            })
            if(!writerJob){
                writerJob = await Job.create({jobName: '编剧', jobENName: 'writer'});
            }
            await RedisLock.unlock(key, uuid)
            if(mongoDoubanMovie.writers){
                for(let i = 0; i < mongoDoubanMovie.writers.length; i++){
                    const item = mongoDoubanMovie.writers[i];
                    await insertOneArtist(mongoDoubanMovie, t, doubanMovie, item, writerJob.jobId)
                }
            }         
        }
        if(result.code !== LockCode.REDIS_LOCK_EXIST){
            break;
        }
    }
}
async function insertDirector(mongoDoubanMovie, t, doubanMovie){
    const key = 'director', uuid = '123456789';
    while(true){
        const result = await RedisLock.lock(key, uuid);
        if(result.success){                         
            //导演
            let directorJob = await Job.findOne({
                where: {
                    jobENName: 'director'
                }
            })
            if(!directorJob){
                directorJob = await Job.create({jobName: '导演', jobENName: 'director'});
            }
            await RedisLock.unlock(key, uuid)
            if(mongoDoubanMovie.directors){                 
                for(let i = 0; i < mongoDoubanMovie.directors.length; i++){
                    const item = mongoDoubanMovie.directors[i];   
                    await insertOneArtist(mongoDoubanMovie, t, doubanMovie, item, directorJob.jobId)
                }
            }      
        }
        if(result.code !== LockCode.REDIS_LOCK_EXIST){
            break;
        }
    }
}

async function insertOneArtist(mongoDoubanMovie, t, doubanMovie, name, jobId){
    const key = 'artist', uuid = '123456789';
    while(true){
        const result = await RedisLock.lock(key, uuid);
        if(result.success){                                          
            let artist = await Artist.findOne({
                where: {
                    name: name
                }
            });
            if(!artist){
                artist = await Artist.create({name: name});
            }
            await RedisLock.unlock(key, uuid)
            await ArtistMovie.create({artistId: artist.artistId, movieId: doubanMovie.movieId});
            await ArtistJob.create({artistId: artist.artistId, jobId: jobId});  
        }
        if(result.code !== LockCode.REDIS_LOCK_EXIST){
            break;
        }
    }
}

async function insertCountry(mongoDoubanMovie, t, doubanMovie){
    const key = 'country', uuid = '123456789';
    //国家/出版地
    if(mongoDoubanMovie.countries){
        for(let i = 0; i < mongoDoubanMovie.countries.length; i++){
            const item = mongoDoubanMovie.countries[i];
            while(true){
                const result = await RedisLock.lock(key, uuid);
                if(result.success){
                    let country = await Country.findOne({
                        where: {
                            countryName: item
                        }
                    });
                    if(!country){
                        country = await Country.create({countryName: item});
                    }
                    await RedisLock.unlock(key, uuid)
                    await CountryMovie.create({countryId: country.countryId, movieId: doubanMovie.movieId}, {transaction: t});
                }
                if(result.code !== LockCode.REDIS_LOCK_EXIST){
                    break;
                }
            }
        }
    }
    
}

async function insertLanguage(mongoDoubanMovie, t, doubanMovie){
    const key = 'language', uuid = '123456789';
    //语言
    if(mongoDoubanMovie.languages){
        for(let i = 0; i < mongoDoubanMovie.languages.length; i++){
            const item = mongoDoubanMovie.languages[i];
            while(true){
                const result = await RedisLock.lock(key, uuid);
                if(result.success){                             
                    let language = await Language.findOne({
                        where: {
                            languageName: item
                        }
                    });
                    if(!language){
                        language = await Language.create({languageName: item});
                    }
                    await RedisLock.unlock(key, uuid)
                    await LanguageMovie.create({languageId: language.languageId, movieId: doubanMovie.movieId}, {transaction: t});         
                }
                if(result.code !== LockCode.REDIS_LOCK_EXIST){
                    break;
                }
            }
        }
    }
}

async function insertType(mongoDoubanMovie, t, doubanMovie){
    const key = 'movieType', uuid = '123456789';
    //类型
    if(mongoDoubanMovie.types){
        for(let i = 0; i < mongoDoubanMovie.types.length; i++){
            const item = mongoDoubanMovie.types[i];
            while(true){
                const result = await RedisLock.lock(key, uuid);
                if(result.success){
                    let type = await Type.findOne({
                        where: {
                            typeName: item
                        }
                    });
                    if(!type){
                        type = await Type.create({typeName: item});
                    }
                    await RedisLock.unlock(key, uuid)
                    await MovieType.create({movieId: doubanMovie.movieId, typeId: type.typeId}, {transaction: t});                    
                }
                if(result.code !== LockCode.REDIS_LOCK_EXIST){
                    break;
                }
            }
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
