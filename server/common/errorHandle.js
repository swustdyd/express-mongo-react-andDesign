/**
 * Created by Aaron on 2018/1/5.
 */
module.exports = function (app) {
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        var message = err.message;
        var error = err;
        if(res.app.get('env') !== 'dev'){
            message =  '系统错误，请联系管理员';
        }
        res.locals.message = message;
        res.locals.error = res.app.get('env') === 'dev' ? err : null;
        // render the error page
        res.status(err.status || 500);
        //xhr请求，返回json数据
        if(req.xhr){
            res.json({message: message, success: false});
        }else{
            res.render('pages/error');
        }
    });
};