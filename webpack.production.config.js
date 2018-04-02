const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./baseConfig');
const productionConfig = [{
    entry: {
        index: ['./client/app'],
        vendor: ['react','react-dom','react-router-dom', 'redux', 'react-redux', 'redux-thunk', 'redux-logger',
            'babel-polyfill', 'fetch-polyfill', 'antd'
        ]
    },
    output: {
        filename: './js/[name].bundle.js',
        path: path.resolve(__dirname, baseConfig.webpackPath),
        publicPath: baseConfig.publicPath,
        chunkFilename: 'js/[name].bundle.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['react']
            }
        },{
            test: /\.(png|jpg)$/,
            use: 'url-loader?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
            })
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader?sourceMap',
                'resolve-url-loader'
            ]
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)/,
            use: ['file-loader']
        }]
    },
    plugins: [
        new CleanWebpackPlugin([baseConfig.webpackPath]),
        new ExtractTextPlugin({
            filename: './stylesheet/[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: 2,
            filename: './js/[name].bundle.js'
        }),
        new webpack.optimize.UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true
            }
        })
    ]
}];

module.exports = productionConfig;
