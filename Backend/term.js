// モジュールを準備

var http = require('http')
var html = require('fs').readFileSync('../designDictionary/html/termDicitionary.html');
var {Client} = require('pg'); 

http.createServer(function (req, res) {

 

    // PostgreSQLに接続

const {Client} = require("pg");
const client = new Client({
    user: "postgres",//ユーザー名
    host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
    database: "postgres",//DB名
    password: "shirokuma123",//ユーザーパスワード
    port: 5432, 
});

    client.connect()

 

    // HTTPレスポンスヘッダを出力

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})

 

    // クエリを実行してTABLEタグで出力

    var query = client.query("select css_code from css_model;",

         function(err, result) {

        res.write('<html><head></head><body><table>');

        for(lc = 0; lc < result.rows.length; lc++){

            res.write('<tr>');

            res.write("<td>"+result.rows[lc].person_id+"</td>" ); 

            res.write("<td>"+result.rows[lc].name+"</td>" ); 

            res.write("<td>"+result.rows[lc].kana+"</td>" ); 

            res.write("<td>"+result.rows[lc].gender+"</td>" ); 

            res.write('</tr>');

        }

        res.end('</table></body></html>')

    });

}).listen(8080)
