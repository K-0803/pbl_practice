
var http = require('http');
var html = require('fs').readFileSync('../designDictionary/html/webCreate.html');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
// const router = require('../designDictionary/html/login.html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../designDictionary/html')));
app.use(express.json());

app.get('/register', function(req, res){
  const filePath = path.join('../designDictionary/html/webCreate.html');
  console.log(filePath);
  res.sendFile(filePath);

  res.end();
});

  app.post('/register', function(req, res){
//     const {email, pass, name} = req.body;
//     console.log(email);
//     console.log(pass);
//     console.log(name);
//     InsData(email, pass , name )
//       .then(function(redUrl){
//         console.log('値は=' + redUrl);
//         if (redUrl === '/redirect') {
//             res.redirect(req.baseUrl + '/login.html');
//             res.end();
           
//         } else {
//             res.end(html);
//         }
//         })
//     .catch((error) => {
//         console.error(error);
//         res.end(html);
//     });

})
app.listen(8080, function(){
  console.log('サーバーがポート8080で起動しました。');
})

// function InsData(email, pass , name ) {
// //postgres接続
//   const { Client } = require("pg");
//   const client = new Client({
//     user: "postgres",//ユーザー名
//     host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
//     database: "postgres",//DB名
//     password: "shirokuma123",//ユーザーパスワード
//     port: 5432,
//   });
// }