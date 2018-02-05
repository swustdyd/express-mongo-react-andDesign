var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var baseConfig = require('./baseConfig');
var port = process.env.PORT || baseConfig.port;
//设置为http模式可以使其在开发过程中，使用?sourceMap时，style-loader会把css做成以下样式
//<link rel="stylesheet" href="blob:http://localhost:3000/a9fe9187-7594-4b1f-b0f6-6ce46bf6cc4e">
var publicPath = 'http://localhost:' + port + '/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var bootstraprcPath = path.resolve(__dirname + '/bootstraprc');
console.log(bootstraprcPath);
var devConfig = {
    entry: {
        index: ['./client/modules/index/index', hotMiddlewareScript],
        movie: ['./client/modules/movie/movie', hotMiddlewareScript],
        user: ['./client/modules/user/user', hotMiddlewareScript]
    },
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, baseConfig.webpackPath),
        publicPath: publicPath,
        libraryTarget : 'var'
    },
    devtool: 'eval-source-map',
    module: {
        rules: [{
            test: /\.(png|jpg)$/,
            use: 'url-loader?limit=8192&context=client&name=./images/[name].[ext]'
        }, {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader?sourceMap',
                'resolve-url-loader',
                'sass-loader?sourceMap'
            ]
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({
            filename: './[name]/index.css',
            allChunks: true
        })
    ],
    resolve: {
        alias: {
            jquery: 'jquery/dist/jquery.min.js'
        }
    }
};

module.exports = devConfig;
