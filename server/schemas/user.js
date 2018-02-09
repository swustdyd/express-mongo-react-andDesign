/**
 * Created by Aaron on 2017/12/15.
 */
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    /*
    * normal user 0
    * admin  user (10,50]
    * super admin  (50,
    */
    role: {
        type: Number,
        default: 0
    },
    meta: {
        createAt:{
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
module.exports = UserSchema;