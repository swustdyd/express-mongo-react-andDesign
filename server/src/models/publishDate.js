import logger from '../common/logger'
import moment from 'moment'
import {sequelize, DataTypes, modelSyncOptions} from '../db/sequelize'
import { dateFormatString, dayFormatString } from '../../../baseConfig'

const PublishDate = sequelize.define('publishDate', {
    publishId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    movieId:{
        type: DataTypes.INTEGER
    },
    publishDate:{
        type: DataTypes.DATE,
        get(){
            return moment(this.getDataValue('publishDate')).format(dayFormatString);
        }
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
            return moment(this.getDataValue('createAt')).format(dateFormatString);
        }
    }
})

// PublishDate.sync(modelSyncOptions).catch((err) => {
//     logger.error(err);
// })

export default PublishDate;