// 引入插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// 多入口管理文件
// less的全局变量
const path = require('path')

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
                publicPath: '../images',
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
            }, "resolve-url-loader"],
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

module.exports = {
    // 入口文件
    entry: entry,
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
    
}