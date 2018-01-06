var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var baseConfig = require('./baseConfig');
var productionConfig = [{
    entry: {
        index: ['./client/pages/index/index'],
        movie: ['./client/pages/movie/movie']
    },
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, baseConfig.webpackPath),
        publicPath: '/'
    },
    module: {
        rules: [{
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
        new CleanWebpackPlugin(['public']),
        new ExtractTextPlugin({
            filename: './[name]/index.css',
            allChunks: true
        })
    ]
}];

module.exports = productionConfig;
