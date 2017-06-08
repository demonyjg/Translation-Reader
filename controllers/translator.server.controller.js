const https = require('https');
module.exports = {
    getTranslation: function (req, res, next,callback) {
        //获取原文
        var tranOriginal = req.body.tranOriginal;
        console.log('tranOriginal: \"' + tranOriginal + '\"');
        var queryString = require('../models/youdao.server.model')(tranOriginal);
        // console.log(queryString);

        https.get(queryString, function (res) {
//            console.log('状态码：', res.statusCode);
//            console.log('请求头：', res.headers);
//            console.log();

            res.on('data', function (d) {
                /*将json转换为JavaScript对象*/
                var data = JSON.parse(d);
                console.log(data);
                callback(data);
            });

        }).on('error', function (e) {
            console.error(e);
        });
    }
};