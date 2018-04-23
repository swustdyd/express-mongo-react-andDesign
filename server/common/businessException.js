/**
 * Created by Aaron on 2018/4/23.
 */

module.exports = function (message, errorCode = 500, extra){
    this.message = message;
    this.errorCode = errorCode;
    this.extra = extra;
};