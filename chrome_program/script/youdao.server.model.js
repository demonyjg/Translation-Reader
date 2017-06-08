function youdaoServerModel(query) {

    var appKey = "30043d620b3ce901";
    var salt = Date.now().toString();
    var from = "en";
    var to = "zh_CHS";


    /*加应用密匙*/
    var msg = appKey + query + salt + '4ZIX3DWANdocWbPO5kuTGvF0jyc9210p';
    var sign = md5(msg);
    console.log(msg, typeof msg, msg.length);
    console.log(sign, typeof sign, sign.length);

//添加params的json
    var params = {
        "q": query,
        "from": from,
        "to": to,
        "appKey": appKey,
        "sign": sign,
        "salt": salt
    };

    var queryString = "https://openapi.youdao.com/api?" + $.param(params);
    console.log(queryString);
    return queryString;
}

