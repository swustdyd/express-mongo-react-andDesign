import logger from '../common/logger'
import moment from 'moment'
import {sequelize, DataTypes, modelSyncOptions} from '../db/sequelize'
import { dateFormatString } from '../../../baseConfig'

const Movie = sequelize.define('movie', {
    movieId:{
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
        type: DataTypes.STRING(500),        
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    average: {
        type: DataTypes.FLOAT(0, 1),
        defaultValue: 0
    },
    picture: {
        type: DataTypes.STRING(255)
    },
    summary: {
        type: DataTypes.STRING(2500)
    },
    durations: {
        type: DataTypes.STRING(500)
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
            return moment(this.getDataValue('createAt')).format(dateFormatString);
        }
    },
    updateAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        get(){
            return moment(this.getDataValue('updateAt')).format(dateFormatString);
        }
    }
});

export default Movie;