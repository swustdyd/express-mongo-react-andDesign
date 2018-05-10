/*
 * @Author: yedong.deng 
 * @Date: 2018-05-10 17:24:31 
 * @Last Modified by:   aaron.deng 
 * @Last Modified time: 2018-05-10 17:24:31 
 */
import path from 'path'
import fs from 'fs'
import BaseController from './baseController'
import PubFunction from '../common/publicFunc'
import BaseConfig from '../../baseConfig'


export default class UtilController extends BaseController{
    constructor(){
        super();
    }

    /**
     * 裁剪图片
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async cutImg(req, res, next){
        try {
            const { file, cutArea, resizeWidth, resizeHeight } = req.body;
            const filePath = PubFunction.parseUrl(file.url).path;
            const inputPath = path.resolve(BaseConfig.root, `public/${filePath}`);
    
            //创建同级目录
            const lastDir = path.dirname(filePath).substr(0, path.dirname(filePath).lastIndexOf('/'));
            const saveDirectory = `${lastDir}/resize`;
            //logger.debug(path.dirname(file.url), lastDir, fs.existsSync(`public/${saveDirectory}`));
            if(!fs.existsSync(path.join(BaseConfig.root, `public/${saveDirectory}`))){
                PubFunction.mkdirsSync(path.join(BaseConfig.root, `public/${saveDirectory}`))
            }
            const savePath = `${saveDirectory}/${file.filename}`;
            const outputPath = path.resolve(BaseConfig.root, `public/${savePath}`);
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
    }
}