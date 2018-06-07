import moment from 'moment'
import {sequelize, DataTypes} from '../db/sequelize'
import { dateFormatString } from '../../../baseConfig'

const ArtistMovie = sequelize.define('artistMovie', {
    artistMovieId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    artistId:{
        type: DataTypes.INTEGER
    },
    movieId:{
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

export default ArtistMovie;