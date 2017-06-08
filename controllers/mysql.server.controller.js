var query = require("../models/mysql.server.model");


String.prototype.StringFormat = function () {
    if (arguments.length == 0) {
        return this;
    }
    for (var StringFormat_s = this, StringFormat_i = 0; StringFormat_i < arguments.length; StringFormat_i++) {
        StringFormat_s = StringFormat_s.replace(new RegExp("\\{" + StringFormat_i + "\\}", "g"), arguments[StringFormat_i]);
    }
    return StringFormat_s;
};

module.exports = {


    //login
    compareDB: function (name, password, callback) {

        var sSQL = "select Pwd from userlist where Name = '" + name + "'";

        query(sSQL, function (error, results, fields) {

            if (error) {
                console.log('[compareDB SELECT ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------compareDB SELECT----------------------------');
            console.log(results[0]);
            console.log('------------------------------------------------------------\n\n');

            return callback(results[0].Pwd == password);

        })

    },

//登陆成功 获取用户ID
    getUserID: function (name, callback) {
        var sSQL = "select ID from userlist where Name = '{0}'".StringFormat(name);

        query(sSQL, function (error, results, fields) {

            if (error || !results || results.length === 0) {
                console.log('[getUserID SELECT ERROR] - ', error.message);
                return callback(error || 'getUserID not results');
            }

            console.log('--------------------------getUserID SELECT----------------------------');
            console.log(results);
            console.log('------------------------------------------------------------\n\n');

            return callback(error, results[0]['ID']);

        })


    },

    //注册
    inputDB: function (name, password) {
        var sSQL = "select * from userlist";
        var Names = [];
        query(sSQL, function (error, results, fields) {

            if (error) {
                console.log('[inputDB SELECT ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------inputDB SELECT----------------------------');
            console.log(results);
            console.log('------------------------------------------------------------\n\n');

            for (var i = 0; i < results.length; i++) {
                Names.push(results[i].Name);
            }

            console.log(Names.indexOf(name) == -1);
            if (Names.indexOf(name) == -1) {
                sSQL = "INSERT INTO userlist(Name, Pwd) VALUES('{0}','{1}')".StringFormat(name, password);
                query(sSQL, function (error1, results1, fields1) {

                    if (error1) {
                        console.log('[inputDB INSERT ERROR] - ', error1.message);
                        return;
                    }

                    console.log('--------------------------inputDB INSERT----------------------------');
                    console.log(results1.insertId);
                    console.log('------------------------------------------------------------\n\n');

                })
            } else {
                return false;
            }

        })


    },

    //已经提交过的数据,给前台
    getHistory: function (ID, Original, URL, callback) {
        var TransHistory = null;
        var sSQL = "select Translation from translatehistory where ID = '{0}' and Original = '{1}' and URL = '{2}'".StringFormat(ID, Original, URL);
        query(sSQL, function (error, results, fields) {

            if (error) {
                console.log('[getHistory SELECT ERROR] - ', error.message);
                return;
            }
            //
            console.log('--------------------------getHistory SELECT----------------------------');
            console.log(results);
            console.log('------------------------------------------------------------\n\n');

            callback(results);

        })

    },


    //系统推荐,后台翻译数据以及赞同数目数据收集、执行函数 没有返回值
    sysRecData: function (Original, Translation) {
        var PassNum = 1;
        var sSQL = "select PassNum from transreco where Original = '{0}' and Translation = '{1}'".StringFormat(Original, Translation);
        query(sSQL, function (error, results, fields) {

            if (error) {
                console.log('[sysRecData SELECT ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------sysRecData SELECT----------------------------');
            console.log(results);
            console.log('------------------------------------------------------------\n\n');

            if (results.length == 0) {
                sSQL = "INSERT INTO transreco(Original, Translation, PassNum) VALUES ('{0}', '{1}', '{2}')".StringFormat(Original, Translation, PassNum);
                query(sSQL, function (error, results, fields) {

                    if (error) {
                        console.log('[sysRecData INSERT ERROR] - ', error.message);
                        return;
                    }

                    console.log('--------------------------sysRecData INSERT----------------------------');
                    console.log('INSERT ID:', results);
                    console.log('-----------------------------------------------------------------\n\n');
                });
                return;
            } else {
                PassNum = results[0].PassNum + 1;
                sSQL = "update transreco set PassNum = '{0}' where Original = '{1}' and Translation = '{2}'".StringFormat(PassNum, Original, Translation);
                query(sSQL, function (error, results, fields) {

                    if (error) {
                        console.log('[sysRecData UPDATE ERROR] - ', error.message);
                        return;
                    }

                    console.log('--------------------------sysRecData UPDATE----------------------------');
                    console.log('UPDATE affectedRows', results.affectedRows);
                    console.log('-----------------------------------------------------------------\n\n');
                });
                return;
            }
        });
        return;
    },

    //系统推荐，传给前台，输入原文 返回所有3个译文
    sysRec: function (Original, callback) {
        var AllTranslation = '';
        var sSql = "select PassNum,Translation from transreco where Original = '{0}'".StringFormat(Original);
        query(sSql, function (error, results) {
            if (error) {
                console.log('[sysRec SELECT ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------sysRec SELECT----------------------------');
            console.log(results);
            console.log('------------------------------------------------------------\n\n');

            var AllPassNum = [], AllTrans = [];

            for (var i = 0; i < results.length; i++) {
                AllPassNum.push(results[i].PassNum);
                AllTrans.push(results[i].Translation);
            }

            var RankingTrans = kp(AllPassNum, AllTrans);

            function kp(num, str) {

                var arra = [];
                var arrc = [];
                var i, j, low, high;


                function QuickSort(arra, low, high, arrc) {

                    var pivot;
                    if (low < high) {
                        function Partition(arra, low, high, arrc) {

                            var pivot = arra[low];

                            function Swap(arra, i, j) {

                                var temp = arra[i];
                                arra[i] = arra[j];
                                arra[j] = temp;

                            }

                            function Swapstr(arrc, i, j) {
                                var temp = arrc[i];
                                arrc[i] = arrc[j];
                                arrc[j] = temp;
                            }

                            while (low < high) {
                                //alert(arra[high]);
                                while (low < high && arra[high] < pivot)
                                    high--;
                                Swap(arra, low, high);

                                Swapstr(arrc, low, high);

                                while (low < high && arra[low] >= pivot)
                                    low++;
                                Swap(arra, low, high);
                                Swapstr(arrc, low, high);
                            }
                            return low;
                        }

                        pivot = Partition(arra, low, high, arrc);
                        QuickSort(arra, low, pivot - 1, arrc);
                        QuickSort(arra, pivot + 1, high, arrc);
                    }
                }

                QuickSort(num, 0, num.length - 1, str);

                return str;
            }

            console.log('AllTranslation:' + RankingTrans, typeof RankingTrans);
            callback(RankingTrans);

        });

    },

    //用户推荐后台，推荐翻译数据收集
    userRecData: function (ID, Original, Translation) {
        var AllTranslation = Translation;
        var AgreedNum = 0;
        var sSQL = "select AllTranslation,AgreedNum from userrecommend where ID = '{0}' and Original = '{1}'".StringFormat(ID, Original);
        query(sSQL, function (error, results, fields) {

            if (error) {
                console.log('[userRecData SELECT ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------userRecData SELECT----------------------------');
            console.log(results);
            console.log('-----------------------------------------------------------------\n\n');

            if (results.length == 0) {
                sSQL = "INSERT INTO userrecommend(ID, Original, AllTranslation, AgreedNum) VALUES ('{0}', '{1}', '{2}','{3}')".StringFormat(ID, Original, AllTranslation, AgreedNum);
                query(sSQL, function (error, results, fields) {

                    if (error) {
                        console.log('[userRecData INSERT ERROR] - ', error.message);
                        return;
                    }

                    console.log('--------------------------userRecData INSERT----------------------------');
                    //console.log('INSERT ID:',result.insertId);
                    console.log('INSERT ID:', results);
                    console.log('-----------------------------------------------------------------\n\n');
                })
            } else {
                var TransList = results[0].AllTranslation.split(';');
                for (var Trans in TransList) {
                    if (Trans == Translation) return false;
                }
                AgreedNum = results[0].AgreedNum;
                AllTranslation = AllTranslation + ";" + Translation;
                sSQL = "userRecData update userrecommend set AllTranslation = '{0}',AgreedNum = '{1}' where ID = '{2}' and Original = '{3}'".StringFormat(AllTranslation, AgreedNum, ID, Original);
                query(sSQL, function (error, results, fields) {

                    if (error) {
                        console.log('[userRecData UPDATE ERROR] - ', error.message);
                        return;
                    }

                    console.log('--------------------------userRecData UPDATE----------------------------');
                    console.log('UPDATE affectedRows', results.affectedRows);
                    console.log('-----------------------------------------------------------------\n\n');
                })

            }


        })


    },

    //用户赞同某用户推荐内容，赞同数加一
    userRecAgreedNumAdd: function (ID, Original) {
        var AgreedNum = 0;
        var sSql = "select AgreedNum from userrecommend where ID = '{0}' and Original = '{1}'".StringFormat(ID, Original);

        query(sSql, function (error, results) {
            if (error) {
                console.log('[userRecAgreedNumAdd SELECT ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------userRecAgreedNumAdd SELECT----------------------------');
            console.log(results);
            console.log('------------------------------------------------------------\n\n');

            if (results.length == 0) {
                AgreedNum = 1;
            } else {
                AgreedNum = results[0].AgreedNum + 1;
            }
            sSql = "update userrecommend set AgreedNum = '{0}' where ID = '{1}' and Original = '{2}'".StringFormat(AgreedNum, ID, Original);
            query(sSql, function (error, results, fields) {

                if (error) {
                    console.log('[userRecAgreedNumAdd UPDATE ERROR] - ', error.message);
                    return;
                }

                console.log('--------------------------userRecAgreedNumAdd UPDATE----------------------------');
                console.log('UPDATE affectedRows', results.affectedRows);
                console.log('-----------------------------------------------------------------\n\n');


            })


        })
    },

    //用户推荐传给前台
    userRec: function (Original) {
        var AllUserTrans = Original;
        var sSql = "select AgreedNum ,ID,AllTranslation from userrecommend where Original = '{0}'".StringFormat(Original);

        query(sSql, function (error, results) {
            if (error) {
                console.log('[userRec SELECT ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------userRec SELECT----------------------------');
            console.log(results);
            console.log('------------------------------------------------------------\n\n');

            var AgreeNum = [], AllTranslation = [], RankingID = [], AllID = [];

            for (var i = 0; i < results.length; i++) {
                AgreeNum.push(results[i].AgreedNum);
                AllTranslation.push(results[i].AllTranslation);
                AllID.push(results[i].ID);
            }

            var RankingTrans = kp(AgreeNum, AllTranslation, AllID);

            function kp(num, str, ID) {

                var arra = [];
                var arrc = [];
                var i, j, low, high;
                var arrcID = [];


                function QuickSort(arra, low, high, arrc, arrcID) {

                    var pivot;
                    if (low < high) {
                        function Partition(arra, low, high, arrc, arrcID) {

                            var pivot = arra[low];

                            function Swap(arra, i, j) {

                                var temp = arra[i];
                                arra[i] = arra[j];
                                arra[j] = temp;

                            }

                            function Swapstr(arrc, i, j, arrcID) {
                                var temp = arrc[i];
                                arrc[i] = arrc[j];
                                arrc[j] = temp;
                                temp = arrcID[i];
                                arrcID[i] = arrcID[j];
                                arrcID[j] = temp;
                            }

                            while (low < high) {
                                //alert(arra[high]);
                                while (low < high && arra[high] < pivot)
                                    high--;
                                Swap(arra, low, high);

                                Swapstr(arrc, low, high, arrcID);

                                while (low < high && arra[low] >= pivot)
                                    low++;
                                Swap(arra, low, high);
                                Swapstr(arrc, low, high, arrcID);
                            }
                            return low;
                        }

                        pivot = Partition(arra, low, high, arrc, arrcID);
                        QuickSort(arra, low, pivot - 1, arrc, arrcID);
                        QuickSort(arra, pivot + 1, high, arrc, arrcID);
                    }
                }

                QuickSort(num, 0, num.length - 1, str, ID);
                var params = {
                    str: str,
                    ID: ID
                };
                return params;
            }

            return RankingTrans;


        })
    },

    //提交生词本
    submitNewWord: function (ID, Original,callback) {
        var sSQL = "INSERT INTO newwordsnotebook(ID, NewWord) VALUES('{0}','{1}')".StringFormat(ID, Original);
        query(sSQL, function (error, results, fields) {

            if (error) {
                console.log('[submitNewWord INSERT ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------submitNewWord INSERT----------------------------');
            console.log(results);
            console.log('------------------------------------------------------------\n\n');
            // console.log('--------------------------fields----------------------------');
            // console.log(fields);
            // console.log('------------------------------------------------------------\n\n');

        })
        callback(true)
    },

    //生词本传给前台
    getNewWordsBook: function (ID,callback) {
        console.log(ID);
        var NewWords = ID.toString();
        var sSql = "select NewWord from newwordsnotebook where ID = '{0}'".StringFormat(ID);

        query(sSql, function (error, results) {
            if (error) {
                console.log('[getNewWordsBook SELECT ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------getNewWordsBook SELECT----------------------------');
            console.log(results);
            console.log('------------------------------------------------------------\n\n');
            for (var i = 0; i < results.length; i++) {
                NewWords = NewWords + ";" + results[i].NewWord;
            }
            return callback(NewWords);

        })
    },

    //提交笔记本
    submitNewNote: function (ID, Original,callback) {
        var sSql = "INSERT INTO newnotesnotebook(ID, NewNote) VALUES ('{0}', '{1}')".StringFormat(ID, Original);
        query(sSql, function (error, results, fields) {

            if (error) {
                console.log('[submitNewNote INSERT ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------submitNewNote INSERT----------------------------');
            //console.log('INSERT ID:',result.insertId);
            console.log('INSERT ID:', results);
            console.log('-----------------------------------------------------------------\n\n');

        })
        callback(true);
    },

    //笔记本传给前台
    getNewNotesBook: function (ID,callback) {
        var NotesAndTrans = ID.toString();
        var sSql1 = "select NewNote from newnotesnotebook where ID = '{0}'".StringFormat(ID);
        var sSql2 = "select Original,AllTranslation from userrecommend where ID = '{0}'".StringFormat(ID);

        query(sSql1, function (error, results1) {
            if (error) {
                console.log('[getNewNotesBook SELECT1 ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------getNewNotes BookSELECT1----------------------------');
            console.log(results1);
            console.log('------------------------------------------------------------\n\n');
            query(sSql2, function (error, results2) {
                if (error) {
                    console.log('[getNewNotesBook SELECT2 ERROR] - ', error.message);
                    return;
                }

                console.log('--------------------------getNewNotesBook SELECT2----------------------------');
                console.log(results2);
                console.log('------------------------------------------------------------\n\n');

                for (var i = 0; i < results1.length; i++) {
                    for (var j = 0; j < results2.length; j++) {
                        if (results1[i].NewNote == results2[j].Original) {
                            NotesAndTrans = NotesAndTrans + "/" + results1[i].NewNote + ":" + results2[j].AllTranslation;
                        }
                    }
                }
                return callback(NotesAndTrans);

            })

        })
    },

    submit: function (ID, Original, URL, Translation, callback) {
        var sSQL = "select * from translatehistory";
        var translateHistory = {
            ID: parseInt(ID), Original: Original, URL: URL, Translation: Translation.toString()
        };
        query(sSQL, function (error, results, fields) {

            if (error) {
                console.log('[submit SELECT ERROR] - ', error.message);
                return;
            }

            // console.log('--------------------------submit SELECT----------------------------');
            // console.log(results);
            // console.log('------------------------------------------------------------\n\n');

            //将RowDataPacket对象装化成json字符串
            var resultsString = JSON.stringify(results);
            //将json字符串转化成json数组
            var resultArray = JSON.parse(resultsString);
            var indexResult = false;

            for (var i = 0; i < resultArray.length; i++) {
                if (JSON.stringify(resultArray[i]) == JSON.stringify(translateHistory)) {
                    indexResult = true;
                }

            }

            if (!indexResult) {
                sSQL = "INSERT INTO translatehistory(ID, Original, URL, Translation) VALUES('{0}','{1}','{2}','{3}')".StringFormat(ID, Original, URL, Translation);
                query(sSQL, function (error1, results1, fields1) {

                    if (error1) {
                        console.log('[submit INSERT ERROR] - ', error1.message);
                        return;
                    }

                    console.log('--------------------------submit INSERT----------------------------');
                    console.log(results1.insertId);
                    console.log('------------------------------------------------------------\n\n');
                    callback(true);

                })
            } else {
                callback(false);
            }

        });
    },


    //系统推荐，不存在数据时初始化函数
    initSysRecData: function (Original, Translation) {
        var PassNum = 0;
        var sSQL = "select PassNum from transreco where Original = '{0}' and Translation = '{1}'".StringFormat(Original, Translation);
        query(sSQL, function (error, results, fields) {

            if (error) {
                console.log('[initSysRecData SELECT ERROR] - ', error.message);
                return;
            }

            console.log('--------------------------initSysRecData SELECT----------------------------');
            console.log(results);
            console.log('------------------------------------------------------------\n\n');
            if (results.length == 0) {
                sSQL = "INSERT INTO transreco(Original, Translation, PassNum) VALUES ('{0}', '{1}', '{2}')".StringFormat(Original, Translation, PassNum);
                query(sSQL, function (error, results, fields) {

                    if (error) {
                        console.log('[initSysRecData SELECT ERROR] - ', error.message);
                        return;
                    }
                    console.log('--------------------------initSysRecData SELECT----------------------------');
                    console.log(results);
                    console.log('------------------------------------------------------------\n\n');
                })
            }
        })
    }
};



