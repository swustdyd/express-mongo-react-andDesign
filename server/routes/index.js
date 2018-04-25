const path = require('path');
const fs = require('fs');
const logger = require('../common/logger');
const BusinessException = require('../common/businessException');
const PubFunction = require('../common/publicFunc');
const BaseConfig = require('../../baseConfig');

module.exports = function (app) {
    app.use('/movie', require('./movie'));
    app.use('/user', require('./user'));
    app.use('/comment', require('./comment'));

    app.get('/', function (request, response, next) {
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
    app.post('/cutImg', async (req, res, next) => {
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

    app.get('/logTest', function (request, response, next) {
        logger.info('info');
        logger.debug('debug');
        logger.warning('warning');
        logger.error('error', new Error('error by test'));
        next(new BusinessException('business exception'));
    });
};
