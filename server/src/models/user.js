import logger from '../common/logger'
import moment from 'moment'
import {sequelize, DataTypes} from '../db/sequelize'
import { dateFormatString } from '../../../baseConfig'

const User = sequelize.define('user', {
    userId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100)
    },
    password: {
        type: DataTypes.STRING(100)
    },
    icon: {
        type: DataTypes.STRING(100)
    },
    role: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
})

export default User;