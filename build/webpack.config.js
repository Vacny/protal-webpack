// 引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const {
    WebPlugin
} = require('web-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
// less的全局变量
const path = require('path')
//单页面路由路径
const allPath = require('./htmlPlugin')

// 入口管理
let entry = {
    app: './src/main.js',
    common: [
        path.join(__dirname, "../src/common/jquery.min.js"),
    ]
}

let plugins = [
    new ExtractTextPlugin({
        filename: 'css/style.css',
        allChunks: true
    }),
    new CleanWebpackPlugin(path.resolve(__dirname, '../dist'), {
        root: path.resolve(__dirname, '../'),
        verbose: true
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
    // new HtmlWebpackPlugin({
    //     filename: path.resolve(__dirname, '../dist/view/index/index.html'),
    //     template: path.resolve(__dirname, '../src/view/index/index.html'),
    //     inject: false
    // }),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
    }),
    // copy custom static assets
    // new CopyWebpackPlugin([{
    //     from: path.resolve(__dirname, '../src/view'),
    //     to: path.resolve(__dirname, '../dist/view'),
    //     ignore: ['.js']
    // }]),
    new webpack.optimize.CommonsChunkPlugin({
        name: "common", // 这个对应的是 entry 的 key
        minChunks: 2
    }),
    new UglifyJSPlugin()
]
plugins = plugins.concat(allPath.htmlPlugin)

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
                publicPath:'../images',
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
                    // root:path.resolve(__dirname, '../src/img'),
                    alias: {
                        '@': path.resolve(__dirname, '../src/img') // '~@/logo.png' 这种写法，会去找src/img/logo.png这个文件
                    },
                    minimize: true //css压缩
                }
            },"resolve-url-loader"],
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
            {
                loader: 'less-loader', // compiles Less to CSS 
            }
        ]
    },
    
    {
        test: /\.html$/,
        use: [{
            loader: 'html-withimg-loader',
        }]
    }
]
const config = {
    // 入口文件
    entry: entry,
    // 出口文件
    output: {
        path: __dirname + '/../dist',
        // 文件名，将打包好的导出为bundle.js
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[name].[chunkhash].js',
        publicPath: './'
    },
    module: {
        // loader放在rules这个数组里面
        rules:rules
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