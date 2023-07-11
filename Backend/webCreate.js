const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const {Client} = require("pg");
const cookieParser = require('cookie-parser');
const router = express.Router();

// const router = require('../designDictionary/html/login.html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../designDictionary')));
app.use(express.json());

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../designDictionary', 'html', 'webCreate.html'));
});

app.post('/generate', function(req, res){
  //cookieに保存されているuserIdとuserNameを取得
  // const userId = req.cookies.userId;
  // const userName = req.cookies.userName;
  //デバッグ用userId
  const userId = 23;
  const userName = 'sssss';


  //入力データの取得
  const {htmlContent, cssContent, comment} = req.body;


  //ファイル名を一意なIDとして生成
  const fileId = uuidv4();

  //HTMLファイルとCSSファイルを生成して保存
  
  const htmlFilePath = `../designDictionary/saveFile/html/${fileId}.html`;
  const cssFilePath = `../designDictionary/saveFile/css/${fileId}.css`;
  fs.writeFileSync(htmlFilePath, htmlContent);
  fs.writeFileSync(cssFilePath, cssContent);
  
  const client = new Client({
      user: "postgres",//ユーザー名
      host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
      database: "postgres",//DB名
      password: "shirokuma123",//ユーザーパスワード
      port: 5432, 
  });
  client.connect();
  const query = {
    text: "INSERT INTO web_create (user_id, user_name, ccss_code, chtml_code, write_comment) VALUES ($1, $2, $3, $4, $5)",
    values: [userId, userName, fileId, fileId, comment],
  };
  client.query(query, function(error, result){
    if(error){
      console.error('データベースエラー：', error);
      // res.status(500).send('データベースエラーが発生しました');
      res.redirect(req.baseUrl + '/html/index.html');
    }else{
      // res.send('ファイルが生成され、データベースに保存されました');
      res.redirect(req.baseUrl + '/html/webCreate.html');
    }
  });

})

module.exports =router;

// app.listen(8080, function(){
//   console.log('サーバーがポート8080で起動しました。');
// })
