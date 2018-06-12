import logger from '../common/logger'
import moment from 'moment'
import {sequelize, DataTypes, modelSyncOptions} from '../db/sequelize'
import { dateFormatString } from '../../../baseConfig'

const AkaWithOther = sequelize.define('akaWithOther', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    akaId:{
        type: DataTypes.INTEGER
    },
    otherId:{
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
            return moment(this.getDataValue('updateAt')).format(dateFormatString);
        }
    }
}, {
    indexes:[
        {
            name: 'idx_otherId',
            method: 'BTREE',
            fields:['otherId']
        }
    ]
})

export default AkaWithOther;