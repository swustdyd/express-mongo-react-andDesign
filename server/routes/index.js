const path = require('path');
const fs = require('fs');
const logger = require('../common/logger');
const MovieService = require('../service/movie');
const PubFunction = require('../common/publicFunc');
const BaseConfig = require('../../baseConfig');

module.exports = function (app) {
    app.use('/movie', require('./movie'));
    app.use('/user', require('./user'));
    app.use('/comment', require('./comment'));

    app.get('/', function (request, response, next) {
        try {
            response.render('pages/index', {
                title: 'imooc 首页'
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

    app.get('/test', function (request, response, next) {
        asyncTest().then(result => {
            response.app.set('jsonp callback name', 'jsonpssCallback');
            response.jsonp(result);
        }).catch( err => next(err) );
    });

    async function asyncTest() {
        return await MovieService.getMoviesByCondition();
    }
};
