/**
 * Created by Administrator on 2017/6/3 0003.
 */
function showmenu() {
    var a = document.getElementById('nav');
    a.style.display = "block";
}
function hidemenu() {
    var a = document.getElementById('nav');
    a.style.display = "none";
}
function shownote() {
    var a = document.getElementById('transmenu');
    a.style.display = "none";
    var b = document.getElementById('notemenu');
    b.style.display = "block";
}

// for (var i = 0; i < fys.length; i++) {
//     var yh = document.getElementById('yh' + i);
//
//     if (yh == '') {
//         yh.style.display.value = 'none';
//     }
// }


function chgimgb() {
    // body...
    var a = document.getElementById('youdao');
    a.style.display = "none";
    var b = document.getElementById('baidu');
    b.style.display = "inline-block";
}
function chgimgy() {
    // body...
    var a = document.getElementById('baidu');
    a.style.display = "none";
    var b = document.getElementById('youdao');
    b.style.display = "inline-block";
}

// if (false) {
//     document.getElementById('addNewNote').onclick = function () {
//         var xhr = new XMLHttpRequest();
//         document.getElementById();
//         xhr.open("GET", '/?', true);
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState == 4) {
//                 // JSON解析器不会执行攻击者设计的脚本.
//                 var resp = JSON.parse(xhr.responseText);
//                 console.log();
//                 xhr.send();
//             }
//         };
//
//     };
// } else {
//     document.getElementById('addNewNote').style.display = none;
//
// }