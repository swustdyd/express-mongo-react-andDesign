/**
 * Created by Aaron on 2018/1/6.
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const logger = require('../common/logger');
const MovieService = require('../service/movie');
const PublicFunc = require('../common/publicFunc');
const DefaultPageSize = require('../common/commonSetting').queryDefaultOptions.pageSize;
const BaseConfig = require('../../baseConfig');

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
        subDir: 'movie/poster/temp',
        fileFilter: ['.png', '.jpg']
    }).then(function (files) {
        if(files){
            files.forEach(item => item.url = `uploads/movie/poster/temp/${item.filename}`);
            res.json({success: true, message: '上传成功', result: files});
        }else{
            res.json({success: false, message: '上传文件为空', result: files});
        }
    }).catch(function (err) {
        logger.error(err);
        res.json({success: false, message: err.message});
    });
});

router.post('/cutPoster', function (req, res) {
    let {file, cutArea, resizeWidth, resizeHeight} = req.body;
    let input = path.resolve(BaseConfig.root, `public/${file.url}`);
    let index = file.url.lastIndexOf('/');
    let savePath = `${path.dirname(file.url.substr(0, index))}/resize/${file.filename}`;
    let output = path.resolve(BaseConfig.root, `public/${savePath}`);
    PublicFunc.cutAndResizeImg(
        input,
        output,
        {
            left: cutArea.x,
            top: cutArea.y,
            width: cutArea.width,
            height: cutArea.height
        },
        resizeWidth,
        resizeHeight
    ).then(() => {
        //sharps = sharp(path.resolve(BaseConfig.root, 'public/uploads/reset.jpg'));
        fs.unlinkSync(input);
        res.json({success: true, message: '裁剪成功', result: Object.assign(file, {url: savePath})});
    }).catch(err => {
        logger.error(err);
        res.json({success: false, message: err.message});
    });
});

router.get('/getMoviesByGroup', (req, res) => {
    let groupArray = JSON.parse(req.query.groupArray || '[]');
    let match = JSON.parse(req.query.match || '{}');
    MovieService.getMoviesByGroup(groupArray, match).then(resData => {
        res.json(resData);
    }).catch(err => {
        logger.error(err);
        res.json({success: false, message: err.message});
    })
});


module.exports = router;