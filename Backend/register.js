const accepts = require('accepts');
var http = require('http');
var html = require('fs').readFileSync('../designDictionary/html/register.html');
var Account = [];
// const router = require('../designDictionary/html/login.html');

http.createServer(function (req, res) {
  var data = '';
  var Account = [];
  var flag = false;
  var x = 0;
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.method === 'POST') {
    req
      .on('data', function (chunk) {
        data += chunk;
        for (var i = 0; i <= data.length; i++) {
          if (flag === true) {
            for (var j = i; j <= data.length; j++) {
              if (data[j] === "&" || j == data.length) {
                flag = false
                Account[x] = data.substring(i, j);
                x++;
                break;
              }
            }
          }
          if (data[i] === "=") {
            flag = true;
            continue;
          }
        }
        InsData(Account, res);
      }).on('end', function () {
        // ...
        res.end(html);
      }).on('error', function (err) {
        console.error(err);
        if (err.message.includes('duplicate key value violates unique constraint "user_info_address_key"')) {
            console.log("error成功");
          errorMessage = '重複したアドレスです。';
        } 
        res.end(html);
      });
  }
}).listen(8080);

function InsData(Account, res) {
//postgres接続
  const { Client } = require("pg");
  const client = new Client({
    user: "postgres",//ユーザー名
    host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
    database: "postgres",//DB名
    password: "shirokuma123",//ユーザーパスワード
    port: 5432,
  });
  //データベース追加
  client.connect()
    .then(() => {
        const query = {
          text: 'INSERT INTO user_info (user_name ,pwd, address ) VALUES ($3, $2, $1);',
          values: [Account[0], Account[1], Account[3]],
        };
        client.query(query)
        .then(() => {
          // ...
          client.query(query)
            .then((res) => {
              console.log(res);
              client.end();
              // 画面転移やレスポンスの処理を行う場合はここに記述する
            })
            .catch((e) => {
              console.error(e.stack);
              client.end();
            });
        });
    });
}