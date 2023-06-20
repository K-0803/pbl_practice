
var http = require('http');
var html = require('fs').readFileSync('../designDictionary/html/register.html');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const resultArray = [];
// const router = require('../designDictionary/html/login.html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../designDictionary')));
app.use(express.json());

app.get('/register', function(req, res){
  const filePath = path.join('../designDictionary/html/register.html');
  console.log(filePath);
  res.sendFile(filePath);

  res.end();
});

  app.post('/register', function(req, res){
    const {email, pass, name} = req.body;
    console.log(email);
    console.log(pass);
    console.log(name);
    InsData(email, pass , name )
      .then(function(redUrl){
        console.log('値は=' + redUrl);
        if (redUrl === '/redirect') {
            res.redirect(req.baseUrl + '/login.html');
            res.end();
           
        } else {
            res.end(html);
        }
        })
    .catch((error) => {
      console.log("functionError");
        console.error(error);
        res.render('register', { error });
    });

})
app.listen(8080, function(){
  console.log('サーバーがポート8080で起動しました。');
})

function InsData(email, pass , name ) {
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
  return new Promise(function(resolve, reject){
    client
        .connect()
        .then(function(){
            const query = {
          text: 'INSERT INTO user_info (user_name ,pwd, address ) VALUES ($3, $2, $1);',
          values: [email, pass , name],
        };
        return client.query(query);
      })
      .then(function(res){
          
          resultCnt = res.rowCount;
          redct='/redirect';
          console.log(resultArray);
          console.log(redct);
          client.end();
          resolve(redct);
      })
      .catch(function(e){
        console.log("SQLerror");
          console.error(e.stack);
          reject(e);
      
      });
});

}