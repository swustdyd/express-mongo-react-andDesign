/**
 * Created by Aaron on 2018/5/4.
 */
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('../baseConfig')

module.exports = {
    entry: {
        vendor: ['./src/common/polyfill', 'react', 'react-dom', 'react-router-dom', 'redux',
            'react-redux', 'redux-thunk', 'redux-logger', 'antd']
    },
    output: {
        path: path.resolve(baseConfig.root, 'public/dist/dll'),
        filename: '[name].dll.js',
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendor_library`
         */
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            /**
             * path
             * 定义 manifest 文件生成的位置
             * [name]的部分由entry的名字替换
             */
            path: path.resolve(baseConfig.root, 'public/dist/dll', '[name]-manifest.json'),
            /**
             * name
             * dll bundle 输出到那个全局变量上
             * 和 output.library 一样即可。
             */
            name: '[name]_library'
        })
    ]
};