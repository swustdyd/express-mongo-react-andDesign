const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 20 });
const path = require('path');
const baseConfig = require('../baseConfig');
const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';
const config = {
    entry: {
        index: './src/app'
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, '../public/dist'),
        publicPath: '/dist/'
    },
    devtool: 'eval-source-map',
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
                loader: 'happypack/loader?id=js',
                include: [path.resolve('src')],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg)$/,
                use: 'url-loader?limit=8192&context=client&name=./images/[name].[ext]'
            },
            {
                test: /\.scss$/,
                loader: 'happypack/loader?id=scss'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
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
            __DEV__: isDev
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            /**
             * 在这里引入 manifest 文件
             */
            manifest: require('./dist/vendor-manifest.json')
        }),
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            loaders: ['babel-loader?cacheDirectory=true']
        }),
        new HappyPack({
            id: 'scss',
            threadPool: happyThreadPool,
            loaders: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader']
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
    /*optimization: {
        minimizer: [
            new webpack.optimize.UglifyJsPlugin({ /!* your config *!/ })
        ]
    },*/
    resolve: {
        modules:[path.resolve(__dirname, 'src'), 'node_modules'],
        unsafeCache: true
    },
    cache: true,
    mode: env
};

if(!isDev){
    config.plugins.push(
        new CleanWebpackPlugin(
            'dist',
            {
                root: path.join(baseConfig.root, 'public'),
                exclude: ['dll'],
                verbose: true,
                dry: false
            }
        )
    );
}

module.exports = config;
