const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require("glob")
const path = require('path')

function getPath(...dir) {
    return path.join(__dirname, '..', 'src', ...dir)
}
function getFilePath(...dir) {
    return path.join(__dirname, '..', 'dist', ...dir)
}
var getEntrySetting = function() {
    let result = {
            entry: {},
            template: [],
            file:[]
        }
    const paths = glob('!(_)*/!(_)*.html', {
        cwd: getPath('view'),
        sync: true
    })
    paths.forEach(file => {
        let pageName = file.split('/')[0]
        result.entry[pageName] = getFilePath('view', pageName,'index.js')
        result.template.push(getPath('view', file))
        result.file.push(getFilePath('view', file))
    })
    return result
}
const allPath = getEntrySetting()

const htmlPlugin = []
allPath.template.forEach((paths,i) => {
    htmlPlugin.push(
        new HtmlWebpackPlugin({
            filename:  allPath.file[i],//生成路径
            template:  paths, //模板路径
            inject: false
        })
    )
})

module.exports = {
    allPath:allPath,
    htmlPlugin:htmlPlugin
}
