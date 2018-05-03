import path from 'path'
import fs from 'fs'
import express from 'express'
import logger from '../common/logger'
import BusinessException from '../common/businessException'
import PubFunction from '../common/publicFunc'
import BaseConfig from '../../baseConfig'
import HttpUtil from '../common/httpUtil'
import MovieRoute from './movie'
import UserRoute from './user'
import CommentRoute from './comment'

const router = express.Router();

router.use('/movie', MovieRoute);
router.use('/user', UserRoute);
router.use('/comment', CommentRoute);

router.get('/', (request, response, next) => {
    try {
        response.render('pages/index', {
            title: BaseConfig.indexPageTitle
        })
    }catch (e){
        next(e)
    }
});

/**
 * 剪切图片
 */
router.post('/cutImg', async (req, res, next) => {
    //next(new BusinessException('裁剪方法尚未实现'));
    try {
        let { file, cutArea, resizeWidth, resizeHeight } = req.body;
        let inputPath = path.resolve(BaseConfig.root, `public/${file.url}`);

        //创建同级目录
        let lastDir = path.dirname(file.url).substr(0, path.dirname(file.url).lastIndexOf('/'));
        let saveDirectory = `${lastDir}/resize/`;
        //logger.debug(path.dirname(file.url), lastDir, fs.existsSync(`public/${saveDirectory}`));
        if(!fs.existsSync(`public/${saveDirectory}`)){
            PubFunction.mkdirsSync(`public/${saveDirectory}`)
        }
        let savePath = `${saveDirectory}/${file.filename}`;
        let outputPath = path.resolve(BaseConfig.root, `public/${savePath}`);
        await PubFunction.cutAndResizeImg(
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

/*** 测试代码 ***/

router.get('/logTest', function (request, response, next) {
    logger.info('info');
    logger.debug('debug');
    logger.warning('warning');
    logger.error('error', new Error('error by test'));
    next(new BusinessException('business exception'));
});

router.get('/download', async (req, res, next) => {
    try{
        let downloadPath = req.query.downloadPath;
        if(!downloadPath){
            res.json({success: false, message: 'downloadPath can\'t be null'});
            res.end();
        }
        HttpUtil.download(
            //url
            `http://119.27.187.248:3001/${path}`,
            //savePath
            path.join(BaseConfig.root, './public/test.pdf'),
            //callback
            (err, data) => {
                if(err){
                    next(err);
                }else {
                    res.send(data);
                }
            }
        );
    }catch (e){
        next(e);
    }
});

export default router;




