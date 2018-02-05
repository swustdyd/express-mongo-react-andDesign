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

/**
 * 每次调用save前都会调用该方法
 */
/*UserSchema.pre('save', function (next) {
    var user = this;
    if(user.isNew){
        user.meta.createAt = user.meta.updateAt = Date.now();
    }else{
        user.meta.updateAt = Date.now();
    }
    //对用户的密码加密，获取一个随机salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
       if(err){
           return next(err);
       }
       //用获取的salt对密码进行加密，存储加密后的hash值
       bcrypt.hash(user.password, salt, function (err, hash) {
           if(err){
               return next(err);
           }
           user.password = hash;
           next();
       })
    });
});*/

/*UserSchema.statics = {
    fetch: function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById: function (id, cb) {
        return this.findOne({_id: id}).exec(cb);
    }
};
UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if(err){
                return cb(err);
            }else{
                cb(null, isMatch);
            }
        })
    }
};*/
module.exports = UserSchema;