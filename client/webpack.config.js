const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const baseConfig = require('../baseConfig');
const devConfig = {
    entry: {
        index: './src/app',
        vendor: ['./src/common/polyfill', 'react', 'react-dom', 'react-router-dom', 'redux',
            'react-redux', 'redux-thunk', 'redux-logger', 'antd']
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/'
    },
    devtool: 'cheap-eval-source-map',
    devServer: {
        contentBase: '/dist/',
        host: 'localhost',
        port: baseConfig.clientPort,
        publicPath: '/dist/',
        hot: true,
        inline: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory=true',
                include: [path.resolve('src')],
                exclude: /node_modules/
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
        new HtmlWebpackPlugin({
            title: baseConfig.indexPageTitle,
            filename: 'index.html',
            template: './src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({
            filename: 'stylesheet/[name].css',
            allChunks: true
        }),
        new webpack.DefinePlugin({
            __DEV__: true
        })
        /* new BundleAnalyzerPlugin({
            // Can be `server`, `static` or `disabled`.
            // In `server` mode analyzer will start HTTP server to show bundle report.
            // In `static` mode single HTML file with bundle report will be generated.
            // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
            analyzerMode: 'server',
            // Host that will be used in `server` mode to start HTTP server.
            analyzerHost: '127.0.0.1',
            // Port that will be used in `server` mode to start HTTP server.
            analyzerPort: 8888,
            // Path to bundle report file that will be generated in `static` mode.
            // Relative to bundles output directory.
            reportFilename: 'report.html',
            // Automatically open report in default browser
            openAnalyzer: true,
            // If `true`, Webpack Stats JSON file will be generated in bundles output directory
            generateStatsFile: false,
            // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
            // Relative to bundles output directory.
            statsFilename: 'stats.json',
            // Options for `stats.toJson()` method.
            // For example you can exclude sources of your modules from stats file with `source: false` option.
            // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            statsOptions: null,
            // Log level. Can be 'info', 'warn', 'error' or 'silent'.
            logLevel: 'info'
        })*/
    ],
    optimization: {
        splitChunks: {
            name: 'vendor',
            minChunks: 2
        }
    },
    resolve: {
        modules:[path.resolve(__dirname, 'src'), 'node_modules'],
        unsafeCache: true
    }
};

module.exports = devConfig;
