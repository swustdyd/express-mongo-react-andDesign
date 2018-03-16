/**
 * Created by Aaron on 2018/1/6.
 */
const express = require('express'),
       router = express.Router();
const _ = require('underscore');
const logger = require('../common/logger');
const MovieService = require('../service/movie');
const PublicFunc = require('../common/publicFunc');
const DefaultPageSize = require('../common/commonSetting').queryDefaultOptions.pageSize;

/**
 * 获取电影列表
 */
router.get('/getMovies', function (req, res) {
    let condition = req.query.condition || '{}';
    let pageIndex = 0;
    if(/^[0-9]+$/.test(req.query.pageIndex)){
        pageIndex = parseInt(req.query.pageIndex);
    }
    let pageSize = DefaultPageSize;
    if(/^[1-9][0-9]*$/.test(req.query.pageSize)){
        pageSize = Math.min(parseInt(req.query.pageSize), DefaultPageSize);
    }
    condition = JSON.parse(condition);

    let newCondition = {};
    if(condition.title){
        newCondition.title = new RegExp(`^${condition.title}.*$`, 'i');
    }
    if(condition._id){
        newCondition._id = condition._id;
    }
    if(condition.searchYear && (condition.searchYear.start || condition.searchYear.end)){
        newCondition.year = {};
        if(condition.searchYear.start){
            newCondition.year.$gte = condition.searchYear.start
        }
        if(condition.searchYear.end){
            newCondition.year.$lte = condition.searchYear.end;
        }

    }
    if(condition.language){
        newCondition.language = condition.language;
    }
    //logger.info(condition);
    MovieService.getMoviesByCondition({
        condition: newCondition,
        pageIndex: pageIndex,
        pageSize: pageSize
    })
    .then(function (resData) {
        res.json(resData);
    }).catch(function (err) {
        logger.error(err);
        res.json({success: false, message: err.message});
    });
});

/**
 * 保存或者修改电影
 */
router.post('/newOrUpdate', function (request, response) {
    let movie = request.body.movie;
    MovieService.saveOrUpdateMovie(movie).then(function (resData) {
        response.json({
            success: true,
            message: resData.message
        })
    }).catch(function (err) {
        logger.error(err);
        response.json({
            success: false,
            message: err.message
        })
    });
});


/**
 * 删除电影
 */
router.get('/delete', function (request, response) {
    let id = request.query.id;
    MovieService.deleteMovieById(id).then(function (resData) {
        if(resData.success){
            response.json({ success: true, message: '删除成功'});
        }else{
            response.json({ success: false, message: '删除失败'});
        }
    }).catch(function (err) {
        logger.error(err);
        response.json({ success: false, message: err.message});
    });
});

router.post('/uploadPoster', function (req, res) {
    PublicFunc.uploadFiles(req, res, {
        subDir: 'movie/poster',
        fileFilter: ['.png', '.jpg']
    }).then(function (files) {
        if(files){
            files.forEach((item, index) => item.src = `uploads/movie/poster/${item.filename}`)
        }
        res.json({success: true, message: '上传成功', result: files});
    }).catch(function (err) {
        logger.error(err);
        res.json({success: false, message: err.message});
    });
});

module.exports = router;