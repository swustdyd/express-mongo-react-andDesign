/**
 * Created by Aaron on 2017/12/15.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
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

/**
 * 每次调用save前都会调用该方法
 */
UserSchema.pre('save', function (next) {
    var user = this;
    if(user.isNew){
        user.meta.createAt = user.meta.updateAt = Date.now();
    }else{
        user.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
       if(err){
           return next(err);
       }
       bcrypt.hash(user.password, salt, function (err, hash) {
           if(err){
               return next(err);
           }
           user.password = hash;
           next();
       })
    });
});

UserSchema.statics = {
    fetch: function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById: function (id, cb) {
        return this.findOne({_id: id}).exec(cb);
    }
};
module.exports = UserSchema;