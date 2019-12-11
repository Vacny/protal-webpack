import router from './router/minrouter.js'

import './common/grid.locale-cn.js'
import './common/jquery.jqGrid.min.js'
import './common/components/selectPlug.js'
import './common/components/jquery.table.js'

import './static/css/jquery-ui.css'
import './static/css/ui.jqgrid.css'


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const requireComponent = require.context(
    './view', true, /index.html$/

)
const filePathArr = [];
requireComponent.keys().forEach(fileName => {
    // console.log(fileName, '-------')
    const componentConfig = requireComponent(fileName);
    const filePath = fileName.replace(/\/index.html$/, '').replace(/^\./, '')
    filePathArr.push(filePath)
})
filePathArr.map(path => {
    router.get(path, function (req, res) {
        res.view(req, res, path)
    })
})


router.addResMethod('view', function (req, res, path) {
    console.log(path)
    $.ajax({
        method: 'get',
        url: '/view' + path + '/index.html'
    }).then(function (html) {
        $('#content').html(html)
        import( /* webpackChunkName: "index/index" */
                '/view' + path + '/index.js')
            .then(myModule => {
                myModule.init()
            });
        // require.ensure([], function (require) {
        //     let currentMod = require('/view' + path + '/index.js');
        //     currentMod.init(req);
        // }, 'index');
    })
})
router.proxyLinks(document.querySelectorAll('a'))
console.log(1111)
router()