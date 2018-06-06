import logger from '../common/logger'
import moment from 'moment'
import {sequelize, DataTypes, modelSyncOptions} from '../db/sequelize'
import { dateFormatString } from '../../../baseConfig'

const ArtistJob = sequelize.define('artistJob', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    artistId:{
        type: DataTypes.INTEGER
    },
    jobId:{
        type: DataTypes.INTEGER
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

// ArtistJob.sync(modelSyncOptions).catch((err) => {
//     logger.error(err);
// })

export default ArtistJob;