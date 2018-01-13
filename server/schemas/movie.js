/**
 * Created by Aaron on 2017/12/12.
 */
var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
    doctor: String,
    title: {
        type: String
    },
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
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
MovieSchema.pre('save', function (next) {
    console.log(this.isNew);
    console.log(this);
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
});

MovieSchema.statics = {
    fetch: function (cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById: function (id, cb) {
        return this.findOne({_id: id}).exec(cb);
    }
};
module.exports = MovieSchema;