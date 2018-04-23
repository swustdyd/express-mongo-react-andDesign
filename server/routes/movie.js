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
const BaseConfig = require('../../baseConfig');
const BusinessException = require('../common/businessException');

/**
 * 获取电影列表
 */
router.get('/getMovies', async function (req, res, next) {
    try {
        let condition = req.query.condition || '{}',
            pageIndex = req.query.pageIndex,
            pageSize = req.query.pageSize;

        condition = JSON.parse(condition);
        let newCondition = {};

        if(condition.title){
            newCondition.title = new RegExp(`^${condition.title}.*$`, 'i');
        }
        if(condition._id){
            newCondition._id = condition._id;
        }

        if(condition.searchYear && condition.searchYear.start){
            newCondition.year = {};
            newCondition.year.$gte = condition.searchYear.start
        }
        if(condition.searchYear && condition.searchYear.end){
            newCondition.year = newCondition.year || {};
            newCondition.year.$lte = condition.searchYear.end;
        }

        if(condition.language){
            newCondition.language = condition.language;
        }

        let resData = await MovieService.getMoviesByCondition({
            condition: newCondition,
            pageIndex: pageIndex,
            pageSize: pageSize
        });
        res.json(resData);
    }catch(e) {
        next(e);
    }
});

/**
 * 保存或者修改电影
 */
router.post('/newOrUpdate', async function (request, response, next) {
    try {
        let movie = request.body.movie;
        let resData = await MovieService.saveOrUpdateMovie(movie);
        let message = movie._id ? '修改成功' : '新增成功';
        if(resData.success){
            resData.message = message;
        }
        response.json(resData);
    }catch (e){
        next(e);
    }
});


/**
 * 删除电影
 */
router.get('/delete', async function (request, response, next) {
    try {
        let id = request.query.id;
        let resData = await MovieService.deleteMovieById(id);
        resData.message = '删除成功';
        response.json(resData);
    }catch (e){
        next(e);
    }
});

router.post('/uploadPoster', async function (req, res, next) {
    try {
        let files = await PublicFunc.uploadFiles(req, res, {
            subDir: 'movie/poster/temp',
            fileFilter: ['.png', '.jpg']
        });
        if(files){
            files.forEach(item => item.url = `uploads/movie/poster/temp/${item.filename}`);
            res.json({success: true, message: '上传成功', result: files});
        }else{
            next(new BusinessException('上传文件为空'));
        }
    }catch (e){
        next(err);
    }
});

router.post('/cutPoster', async function (req, res, next) {
    try {
        let { file, cutArea, resizeWidth, resizeHeight } = req.body;
        let inputPath = path.resolve(BaseConfig.root, `public/${file.url}`);

        //创建同级目录
        let lastDir = path.dirname(file.url).substr(0, path.dirname(file.url).lastIndexOf('/'));
        let saveDirectory = `${lastDir}/resize/`;
        //logger.debug(path.dirname(file.url), lastDir, fs.existsSync(`public/${saveDirectory}`));
        if(!fs.existsSync(`public/${saveDirectory}`)){
            PublicFunc.mkdirsSync(`public/${saveDirectory}`)
        }
        let savePath = `${saveDirectory}/${file.filename}`;
        let outputPath = path.resolve(BaseConfig.root, `public/${savePath}`);
        await PublicFunc.cutAndResizeImg(
            inputPath,
            outputPath,
            {
                left: cutArea.x,
                top: cutArea.y,
                width: cutArea.width,
                height: cutArea.height
            },
            resizeWidth,
            resizeHeight
        );
        //删除原图
        fs.unlinkSync(inputPath);
        res.json({
            success: true,
            message: '裁剪成功',
            result: Object.assign(file, {url: savePath})
        });
    }catch (e){
        next(e);
    }
});

router.get('/getMoviesByGroup', async (req, res, next) => {
    try {
        let groupArray = JSON.parse(req.query.groupArray || '[]');
        let match = JSON.parse(req.query.match || '{}');
        let resData = await MovieService.getMoviesByGroup(groupArray, match);
        res.json(resData);
    }catch (e){
        next(err);
    }
});

module.exports = router;