import path from 'path'
import fs from 'fs'
import express from 'express'
import PubFunction from '../common/publicFunc'
import BaseConfig from '../../baseConfig'
import MovieRoute from './movie'
import UserRoute from './user'
import CommentRoute from './comment'
import TestRoute from './test'

const router = express.Router();

router.use('/movie', MovieRoute);
router.use('/user', UserRoute);
router.use('/comment', CommentRoute);
router.use('/test', TestRoute);

router.get('/', (request, response, next) => {
    try {
        response.redirect('/dist/index.html');
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
        let filePath = PubFunction.parseUrl(file.url).path;
        let inputPath = path.resolve(BaseConfig.root, `public/${filePath}`);

        //创建同级目录
        let lastDir = path.dirname(filePath).substr(0, path.dirname(filePath).lastIndexOf('/'));
        let saveDirectory = `${lastDir}/resize`;
        //logger.debug(path.dirname(file.url), lastDir, fs.existsSync(`public/${saveDirectory}`));
        if(!fs.existsSync(path.join(BaseConfig.root, `public/${saveDirectory}`))){
            PubFunction.mkdirsSync(path.join(BaseConfig.root, `public/${saveDirectory}`))
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
        //fs.unlinkSync(inputPath);
        res.json({
            success: true,
            message: '裁剪成功',
            result: Object.assign(file, {url:  PubFunction.rebuildImgUrl(savePath)})
        });
    }catch (e){
        next(e);
    }
});

export default router;




