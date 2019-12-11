// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack')
// 多入口管理文件
// less的全局变量
const path = require('path')

const allPath = require('./htmlPlugin')

// 入口管理
let entry = {
    app: './src/main.js',
    common: [
        path.join(__dirname, "../src/common/jquery.min.js"),
    ]
    // 引入jQuery，这个是为了配合 webpack.optimize.CommonsChunkPlugin 这个插件使用。
}
let rules = [{
        test: /\.js$/,
        exclude: /node_modules/,
        // 写法一
        loader: 'babel-loader'
    },
    {
        test: /\.(png|jpg|jpe?g|gif|svg)$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 4096,
                name: '[hash].[ext]',
                outputPath: function (fileName) {
                    return 'images/' + fileName // 后面要拼上这个 fileName 才行
                }
            }
        }]
    },
    {
        test: /\.css$/,
        // use: [ 'style-loader', 'css-loader' ]
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
            use: [{
                loader: 'css-loader',
                options: {
                    publicPath:'../',
                    minimize: true //css压缩
                }
            },'resolve-url-loader'],
        })
    },
    {
        test: /\.less$/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    root: path.resolve(__dirname, '../src/static'), // url里，以 / 开头的路径，去找src/static文件夹
                    minimize: true, // 压缩css代码
                    // sourceMap: true,    // sourceMap，默认关闭
                    alias: {
                        '@': path.resolve(__dirname, '../src/img') // '~@/logo.png' 这种写法，会去找src/img/logo.png这个文件
                    }
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    config: {
                        path: './config'
                    },
                    sourceMap: true
                }
            },
        ]
    },
    
    {
        test: /\.html$/,
        use: [{
            loader: 'html-withimg-loader',
        }]
    }
]
let plugins = [
    new ExtractTextPlugin({
        filename: 'css/style.css',
        allChunks: true
    }),
    new CleanWebpackPlugin(path.resolve(__dirname, '../dist'), {
        root: path.resolve(__dirname, '../'),
        verbose: true,
        dry: false
    }),
    new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../dist/index.html'),
        template: path.resolve(__dirname, '../src/index.html'),
        inject: 'true',

        // 需要依赖的模块
        chunks: ['common', 'app'],

        // 根据依赖自动排序
        chunksSortMode: 'dependency'
    }),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
    }),
    new UglifyJSPlugin(),
    new webpack.HotModuleReplacementPlugin()
]
plugins = plugins.concat(allPath.htmlPlugin)
const config = {
    // 入口文件
    entry: entry,
    // 出口文件
    output: {
        path: __dirname + '/../dist',
        // 文件名，将打包好的导出为bundle.js
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    devServer: {
        // contentBase: './dist',
        hot: true,
        port: 8090
    },
    module: {
        // loader放在rules这个数组里面
        rules: rules
    },
    resolve: {
        alias: {
            // js
            jquery: path.join(__dirname, "../src/common/jquery.min.js"),

        }
    },
    // 将插件添加到webpack中
    // 如果还有其他插件，将两个数组合到一起就行了
    plugins: plugins
}
module.exports = config