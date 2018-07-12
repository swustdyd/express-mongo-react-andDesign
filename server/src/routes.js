import express from 'express'
import path from 'path'
import fs from 'fs'

/**
 * 路由
 */
const router = express.Router();

/**
 * 根目录重定向到index.html
 */
router.get('/', (req, res) => {
    res.redirect('/dist/index.html');
});

// 读取controller文件夹下的文件
const dirPath = path.resolve(__dirname, 'controller');
const controllers = fs.readdirSync(dirPath).map((fileName) => {
    const controller = require(path.join(dirPath, fileName)).default;
    return new controller();
})

controllers.forEach((controller) => {
    if(controller._routes && controller._routes.length > 0){
        controller._routes.forEach((item) => {
            const url = controller._basePath + item.path
            console.log(url, item.fnName);
            router[item.method](url, controller[item.fnName].bind(controller));
        });
    }
})

export default router;