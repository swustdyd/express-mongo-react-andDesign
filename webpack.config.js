let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let path = require('path');
let baseConfig = require('./baseConfig');
let port = process.env.PORT || baseConfig.port;
//设置为http模式可以使其在开发过程中，使用?sourceMap时，style-loader会把css做成以下样式
//<link rel="stylesheet" href="blob:http://localhost:3000/a9fe9187-7594-4b1f-b0f6-6ce46bf6cc4e">
let publicPath = 'http://localhost:' + port + '/';
let hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
//console.log(vueLoaderConfig);
let devConfig = {
    entry: {
        index: ['./client/app', hotMiddlewareScript],
        vendor: ['react','react-dom','react-router-dom']
    },
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, baseConfig.webpackPath),
        publicPath: publicPath,
        libraryTarget : 'var'
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react']
                }
            },
            {
                test: /\.(png|jpg)$/,
                use: 'url-loader?limit=8192&context=client&name=./images/[name].[ext]'
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader?sourceMap',
                    'resolve-url-loader',
                    'sass-loader?sourceMap'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader?sourceMap',
                    'resolve-url-loader'
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({
            filename: './[name]/index.css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js'
        })
    ]
};

module.exports = devConfig;
