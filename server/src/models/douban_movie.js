import logger from '../common/logger'
import moment from 'moment'
import {db, DataTypes, modelSyncOptions} from '../db'
import { dataFormatString } from '../../../baseConfig'

const DoubanMovie = db.define('douban_movie', {
    guid:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    doubanMovieId: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        validate:{
            is:{
                args: ['^[0-9]+$'],
                msg: '豆瓣电影的id必须为数字'
            }
        }
    },
    name: {
        type: DataTypes.STRING(50)
    },
    year: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    average: {
        type: DataTypes.FLOAT(0, 1),
        defaultValue: 0
    },
    mainpic: {
        type: DataTypes.STRING(255)
    },
    summary: {
        type: DataTypes.STRING(2500)
    },
    directors: {
        type: DataTypes.STRING(1000)
    },
    writers: {
        type: DataTypes.STRING(1000)
    },
    actors: {
        type: DataTypes.STRING(1000)
    },
    types: {
        type: DataTypes.STRING(200)
    },
    countries: {
        type: DataTypes.STRING(200)
    },
    languages: {
        type: DataTypes.STRING(200)
    },
    pubdates: {
        type: DataTypes.STRING(200)
    },
    durations: {
        type: DataTypes.STRING(50)
    },
    aka: {
        type: DataTypes.STRING(200)
    },
    IMBdLink: {
        type: DataTypes.STRING(200)
    },
    officialWebsite: {
        type: DataTypes.STRING(200)
    },
    season: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    count: {
        type: DataTypes.STRING(100)
    },
    createAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        get(){
            return moment(this.getDataValue('createAt')).format(dataFormatString);
        }
    },
    updateAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        get(){
            return moment(this.getDataValue('createAt')).format(dataFormatString);
        }
    }
});

DoubanMovie.sync(modelSyncOptions).catch((err) => {
    logger.error(err);
})

export default DoubanMovie;