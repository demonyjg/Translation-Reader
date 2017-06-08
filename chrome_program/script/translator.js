/**
 * Created by Administrator on 2017/5/11 0011.
 */

console.log('编程式注入已开启');

var html =
    '<div id="chromeTran" class="modal fade" role="dialog" aria-hidden="true">' +
    '<div class="modal-dialog modal-sm" role="document">' +
    '<div class="modal-content">' +

    '<div class="modal-header">' +
    '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
    '<span aria-hidden="true" class="glyphicon glyphicon-user"></span></button>' +
    '<h4 class="modal-title" id="exampleModalLabel">Translator</h4>' +
    '</div>' +

    '<form id="tranForm" method="post" action="http://localhost:8000/" target="_blank">' +
    '<div class="modal-body">' +
    '<div class="form-group">' +
    '<label for="tranOriginal" class="control-label">原文:</label>' +
    '<input type="text" class="form-control" id="tranOriginal" name="tranOriginal">' +
    '</div>' +
    '<div class="form-group">' +
    '<label for="tranTranslation" class="control-label">译文:</label>' +
    '<input type="text" class="form-control" id="tranTranslation" name="tranTranslation">' +
    '</div>' +
    '<div class="form-group" style="display: none">' +
    '<input type="text" class="form-control" id="url" name="url">' +
    '</div>' +
    '</div>' +
    '<div class="modal-footer">' +
    '<button type="button" class="btn btn-default" id="replace">替换</button>' +
    '<button type="submit" class="btn btn-primary" id="more">更多</button>' +
    '</div>' +
    '</form>' +
    '</div>' +
    '</div>' +
    '</div>';


//创建div
function createDiv() {
    var div = document.createElement('div');
    div.className = 'container';
    div.innerHTML = html;
    div.id = 'divHtml';
    document.body.appendChild(div);
    $('#tranOriginal')[0].focus();
    return div;
}

// 移除div
function deleteDiv() {
    $('#divHtml').remove();
    $('.modal-backdrop').remove();
}


//获取网页划取内容
function tranSelection() {
    var txt, txtObj;
    if (document.selection) {
        txtObj = document.selection;
        txt = txtObj.createRange().text;
    } else {
        txtObj = window.getSelection();
        txt = txtObj + '';
    }
    console.log(txt, typeof txt);
    console.log(txtObj, typeof txtObj);

    return [txtObj, txt];
}


$(document).ready(
    function () {
        document.onkeyup = function () {
            var oEvent = window.event;
            if (oEvent.keyCode == 90 && oEvent.ctrlKey) {


                //获取网页划取内容
                var selContent = tranSelection()[1];

                if (selContent != '') {

                    //删除之前的div
                    deleteDiv();
                    //创建div
                    createDiv();

                    var queryString = youdaoServerModel(selContent);

                    //原文赋值
                    document.getElementById('tranOriginal').setAttribute("value", selContent);
                    // 1，设置或获取对象指定的文件名或路径。

                    // alert(window.location.pathname)

                    // 2，设置或获取整个 URL 为字符串。

                    // alert(window.location.href);

                    // 3，设置或获取与 URL 关联的端口号码。
                    //
                    // alert(window.location.port)

                    // 4，设置或获取 URL 的协议部分。

                    // alert(window.location.protocol)

                    // 5，设置或获取 href 属性中在井号“#”后面的分段。

                    // alert(window.location.hash)

                    // 6，设置或获取 location 或 URL 的 hostname 和 port 号码。

                    // alert(window.location.host)

                    // 7，设置或获取 href 属性中跟在问号后面的部分。

                    // alert(window.location.search)
                    // 路径赋值
                    document.getElementById('url').setAttribute("value", selContent);

                    $('#chromeTran').modal({
                        keyboard: false
                    });
                    var tran;
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", queryString, true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            // JSON解析器不会执行攻击者设计的脚本.
                            var resp = JSON.parse(xhr.responseText);
                            tran = resp.translation;
                            console.log(resp.translation, typeof resp.translation);

                            /*译文赋值*/
                            document.getElementById('tranTranslation').setAttribute("value", resp.translation);
                            $('#replace').onclick = tranReplace(tran);
                        }
                    };
                    xhr.send();
                    // var selObj = tranSelection()[0].anchorNode;
                    // console.log('caonima', selObj);
                    // bianli(selObj)
                }

            }
        }
    }
);

function tranReplace(tran) {
    var selObj = tranSelection()[0];
    console.log(
        selObj.anchorNode.replaceData(selObj.anchorOffset, (selObj + '').length, tran),
        // selObj.anchorNode.nextSibling.firstChild.nextSibling,
        selObj.focusNode,
        selObj.anchorOffset,
        selObj.focusOffset
    );


// window.getSelection().anchorNode.parentNode.removeChild(window.getSelection().anchorNode);
}


function bianli(node) {
    if (node && node.tagName != 'body') {

        if (node.nodeType != 3) {
            if (node.childNodes && node.childNodes.length > 0) {

                for (var i = 0; i < node.childNodes.length; i++) {

                    arguments.callee(node.childNodes[i])
                }
            }
        } else {
            if (node.nodeValue != '') {

                console.log(node.nodeValue);
            }
            if (node.nextSibling) {
                arguments.callee(node.nextSibling);

            } else {
                if (node.parentNode.nextSibling) {

                    arguments.callee(node.parentNode.nextSibling);
                } else {
                    console.log(node.parentNode);
                    if (node.parentNode.parentNode.nextSibling) {
                        arguments.callee(node.parentNode.parentNode.nextSibling);

                    } else {
                        arguments.callee(node.parentNode.parentNode.parentNode.nextSibling);

                    }

                }
            }
        }

    }
}