const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack')
const path = require('path')

const baseConfig = require('./webpack.base.config')
const merge = require('webpack-merge')
const allPath = require('./htmlPlugin')
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
const config = merge(baseConfig,{
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
    plugins:plugins
})
module.exports = config