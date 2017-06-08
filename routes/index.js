var express = require('express');
var router = express.Router();
var tranOriginal;
var translatorServerController = require('../controllers/translator.server.controller.js');
var mysqlServerController = require('../controllers/mysql.server.controller.js');
router.post('/index.html', function (req, res, next) {
    console.log('登录页面data', req.body);
    mysqlServerController.compareDB(req.body.u, req.body.p, function (data) {
        if (data) {
            console.log('登录成功!', data);

            mysqlServerController.getUserID(req.body.u, function (e, id) {

                var dataParams = {
                    data: data
                };
                console.log(JSON.stringify(params).slice(0, -1) + ',' + JSON.stringify(dataParams).slice(1));
                var indexPostParam = JSON.parse(JSON.stringify(params).slice(0, -1) + ',' + JSON.stringify(dataParams).slice(1))

                // 默认加入笔记本
                // mysqlServerController.submitNewNote(id,indexPostParam.tranOriginal);
                res.render('index', indexPostParam);
            });
        } else {
            console.log('登陆失败!', data);
            // res.render('index');

        }
    });
});

router.post('/submit', function (req, res, next) {
    console.log('+++++++', req.body.tran);

    mysqlServerController.submit('1',tranOriginal, req.body.tranUrl, req.body.tran, function (d) {
        mysqlServerController.sysRecData(tranOriginal,req.body.tran);
        mysqlServerController.userRecData('1',tranOriginal,req.body.tran);
        res.render('index', params);
    });
});

router.post('/notebook', function (req, res, next) {
    console.log('+++++++', req.body.tran1);
    mysqlServerController.submitNewNote('1', tranOriginal, function (d) {

        res.render('index', params);
    });
});

router.post('/newWords', function (req, res, next) {
    console.log('+++++++', req.body.tran2);
    mysqlServerController.submitNewWord('1', tranOriginal, function (d) {

        res.render('index', params);
    });
});
/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.body);
    res.render('index');
});

router.get('/text.html', function (req, res, next) {
    console.log(req.body);
    mysqlServerController.getNewNotesBook('1',function (data) {

    res.render('text',{data:data});
    });
});

router.get('/newword.html', function (req, res, next) {
    console.log(req.body);
    mysqlServerController.getNewWordsBook('1',function (data) {

        res.render('newword',{data:data});
    });
});

router.get('/login.html', function (req, res, next) {
    res.render('login');
});

router.post('/login.html', function (req, res, next) {
    res.render('login');
});

router.get('/register.html', function (req, res, next) {
    res.render('register');
});

router.post('/register.html', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username, password);
    mysqlServerController.inputDB(username, password);


});


router.post('/', function (req, res, next) {
    var tranUrl = "youdao";
    tranOriginal = req.body.tranOriginal;

//    console.log("************************************" + url);
    var tranTranslation;
    // console.log(tranUrl);
    translatorServerController.getTranslation(req, res, next, function (data) {
        tranTranslation = data.translation;

        console.log(data.basic.explains, data.basic.explains.length);
        var index = 0;
        //提交单词、句子历史记录表
        if (data && data.basic && data.basic.explains) {
            for (var i = 0; i < data.basic.explains.length; i++) {
                mysqlServerController.submit('0', tranOriginal, tranUrl, data.basic.explains[i], function (d) {

                    index++;
                    if (index == data.basic.explains.length - 1) {
                        mysqlServerController.getHistory('0', tranOriginal, tranUrl, function (data) {
                            // console.log('getHistory tranTranslation:' + data)
                            getSysRec(data);

                        });
                    }

                    // if (d) {
                    //     console.log('提交单词历史记录表成功');
                    // } else {
                    //     console.log('提交单词历史记录表失败,该data存在');
                    // }
                });
            }
        } else {
            mysqlServerController.submit('0', tranOriginal, tranUrl, tranTranslation, function (d) {

                mysqlServerController.getHistory('0', tranOriginal, tranUrl, function (data) {
                    // console.log('getHistory tranTranslation:' + data)
                    getSysRec(data);
                });

                // if (data) {
                //     // console.log('提交句子历史记录表成功');
                // } else {
                //     // console.log('提交句子历史记录表失败,该data存在');
                // }
            });
        }

        function getSysRec(d) {
            //将RowDataPacket对象装化成json字符串
            var dString = JSON.stringify(d);
            //将json字符串转化成json数组
            var dArray = JSON.parse(dString);
            var index = 0;
            console.log(dArray[0].Translation);
            for (var i = 0; i < d.length; i++) {

                mysqlServerController.initSysRecData(tranOriginal, dArray[i].Translation);

                index++;
                if (index == d.length - 1) {
                    mysqlServerController.sysRec(tranOriginal, function (data) {
                        //3个系统推荐译文 array 类型
                        params = {
                            tranOriginal: tranOriginal,
                            tranTranslation: tranTranslation,
                            fy1: data[0],
                            fy2: data[1],
                            fy3: data[2]
                        };
                        res.render('index', params);

                    });

                    // mysqlServerController.userRec(tranOriginal, function (data) {
                    //     //3个用户推荐译文 json.array 类型
                    //     console.log('hahahahhahahha', data);
                    //     var ID = data.ID;
                    //     var AllTranslation = data.str;
                    //     var AllUserTrans = [];
                    //     if (ID.length < 3) {
                    //         for (var i = 0; i < ID.length; i++) {
                    //             AllUserTrans[i] = ID[i] + ':' + AllTranslation[i];
                    //         }
                    //         for (var i = ID.length; i < 3; i++) {
                    //             AllUserTrans[i] = '';
                    //         }
                    //     } else {
                    //         for (var i = 0; i < 3; i++) {
                    //             AllUserTrans[i] = ID[i] + ':' + AllTranslation[i];
                    //         }
                    //     }
                    //
                    //     params = {
                    //         tranOriginal: tranOriginal,
                    //         tranTranslation: tranTranslation,
                    //         AllUserTrans1: AllUserTrans[0],
                    //         AllUserTrans2: AllUserTrans[1],
                    //         AllUserTrans3: AllUserTrans[2],
                    //         fy1: data[0],
                    //         fy2: data[1],
                    //         fy3: data[2]
                    //     };
                    //     res.render('index', params);

                    // });
                }
            }
        }


    });


    // mysqlServerController.inputDB('123', '123456');
    // mysqlServerController.compareDB('123', '123456');
    // var ID;
    // mysqlServerController.getUserID('123',function (error,results) {
    //     if (error){
    //         return console.log(error);
    //     }
    //     ID = results;
    //     // mysqlServerController.submit(ID, 'one', '123.123.123.123','ONE');
    //     // mysqlServerController.getHistory(ID, 'one', '123.123.123.123');
    //获取此原文译文的点赞数
    //     mysqlServerController.sysRecData('one', 'ONE');
    //
    //     // mysqlServerController.sysRec('one');
    //     // mysqlServerController.userRecData(ID, 'one', 'ONE');
    //     // mysqlServerController.userRecAgreedNumAdd(ID, 'one');
    //     // mysqlServerController.userRec('one');
    //     // mysqlServerController.submitNewWord(ID, 'one');
    //     // mysqlServerController.getNewWordsBook(ID);
    //     // mysqlServerController.submitNewNote(ID, 'one');
    //     // mysqlServerController.getNewNotesBook(ID);
    // });


})


module.exports = router;

