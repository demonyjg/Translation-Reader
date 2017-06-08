/**
 * Created by Administrator on 2017/6/2 0002.
 */
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'translate',
    port: '3306'
});

var query = function (sql, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err, null, null);
        } else {
            // Use the connection
            connection.query(sql, function (error, results, fields) {
                // And done with the connection.
                connection.release();

                //事件驱动回调
                callback(error, results, fields);

                // Handle error after the release.
                if (error) throw error;

                // Don't use the connection here, it has been returned to the pool.
            });
        }
    });
};

module.exports = query;