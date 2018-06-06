import logger from '../common/logger'
import moment from 'moment'
import {sequelize, DataTypes, modelSyncOptions} from '../db/sequelize'
import { dateFormatString } from '../../../baseConfig'

const Aka = sequelize.define('aka', {
    akaId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    akaName:{
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
            return moment(this.getDataValue('createAt')).format(dateFormatString);
        }
    }
})

// Aka.sync(modelSyncOptions).catch((err) => {
//     logger.error(err);
// })

export default Aka;