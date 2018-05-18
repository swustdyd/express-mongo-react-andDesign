import mongoose from 'mongoose'
import DoubanMovieService from '../service/doubanMovieService'
import logger from '../common/logger'
import BaseConfig from '../../baseConfig'

mongoose.connect(BaseConfig.dbConnectString);
const doubanMovieService = new DoubanMovieService();

doUpdate();

async function doUpdate() {
    try {
        const {total} = await doubanMovieService.getDoubanMovies();
        const pageSize = 50;
        const pageEndIndex = Math.ceil(total / pageSize);
        console.log(`电影总数为：${total}, pageEndIndex: ${pageEndIndex}, pageSize: ${pageSize}`);
        for(let pageIndex = 0; pageIndex < pageEndIndex; pageIndex++){
            console.log(`更新数据：${pageIndex * pageSize + 1} 到 ${pageIndex * pageSize + pageSize} 条`);
            const {result} = await doubanMovieService.getDoubanMovies(pageIndex, pageSize);            
            const promiseList = [];
            for(let i = 0; i < result.length; i++){
                const doubanMovie = result[i];
                promiseList.push(updateOne(doubanMovie));
            }
            await Promise.all(promiseList);

        }
        console.log('更新成功');
        process.exit();
    } catch (error) {
        console.log(error);
        logger.error(error);
        process.exit();
    }
}

async function updateOne(doubanMovie){
    const typeKeys = ['types', 'countries', 'languages'];
    for(let j = 0; j < typeKeys.length; j++){
        const typeKey = typeKeys[j];
        const movieProperty = doubanMovie[typeKey];
        if(movieProperty instanceof Array){
            for(let k = 0; k < movieProperty.length; k++){
                const {result: movieTypes} = await doubanMovieService.getMovieTypeByOption({
                    condition: {
                        mongoObjectId: doubanMovie._id,
                        typeKey: typeKey,
                        typeValue: movieProperty[k]
                    }
                });
                if(movieTypes.length < 1){
                    await doubanMovieService.saveMovieAndType({
                        doubanMovieId: doubanMovie.doubanMovieId,
                        mongoObjectId: doubanMovie._id,
                        typeKey: typeKey,
                        typeValue: movieProperty[k]
                    })
                }
            }
        }else{
            const {result: movieTypes} = await doubanMovieService.getMovieTypeByOption({
                condition: {
                    mongoObjectId: doubanMovie._id,
                    typeKey: typeKey,
                    typeValue: movieProperty
                }
            });
            if(movieTypes.length < 1){
                await doubanMovieService.saveMovieAndType({
                    doubanMovieId: doubanMovie.doubanMovieId,
                    mongoObjectId: doubanMovie._id,
                    typeKey: typeKey,
                    typeValue: movieProperty
                })
            }
        }
    }
}
