import logger from '../common/logger'
import moment from 'moment'
import {sequelize, DataTypes, modelSyncOptions} from '../db/sequelize'
import { dayFormatString, dateFormatString } from '../../../baseConfig'

const Artist = sequelize.define('artist', {
    artistId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100)
    },
    type:{
        type: DataTypes.STRING(20)
    },
    summary: DataTypes.STRING(1000),
    sex:{
        type: DataTypes.STRING(20),
        validate:{
            isIn:{
                args:[['男', '女']],
                msg: '性别只能是男或者女'
            }
        }
    },
    birthday:{
        type: DataTypes.DATE,
        get(){
            return moment(this.getDataValue('birthday')).format(dayFormatString)
        }
    },
    birthpalce:{
        type: DataTypes.STRING(100)
    },
    imdbNumber:{
        type: DataTypes.STRING(100)
    },
    picture:{
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
});

// Artist.sync(modelSyncOptions).catch((err) => {
//     logger.error(err);
// })

export default Artist;