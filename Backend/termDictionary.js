const http = require('http');
const { Pool } = require('pg');
const fs = require('fs');

const path = require('path');   //相対パスを使用可能にする
const bodyParser = require('body-parser');  //req.bodyを使用できるようにする
const express = require('express');
const app = express();
const router = express.Router();

//ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: false }));    //req.bodyを使用するためのミドルウェア
app.use(bodyParser.json());                             //
app.use(express.static(path.join(__dirname, '../designDictionary')));; //相対パスを使用するためのミドルウェア
app.use(express.json());

// データベースの接続情報
const dbConfig = {
    user: "postgres",//ユーザー名
    host: "database-1.c8lfh7qeqrkx.us-east-1.rds.amazonaws.com",//ホスト
    database: "postgres",//DB名
    password: "shirokuma123",//ユーザーパスワード
    port: 5432,
};
// データベース接続
const pool = new Pool(dbConfig);

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../designDictionary', 'html', 'termDictionary.html'));
  console.log(sendFile);
});


  router.post('/',function(req,res){
    const cssQuery = 'SELECT * FROM css_model';
    const htmlQuery = 'SELECT * FROM html_model';
  
    // プロミスの配列を作成
    const promises = [
      pool.query(cssQuery),
      pool.query(htmlQuery)
    ];
  
    Promise.all(promises)
      .then(results => {
        const cssRows = results[0].rows;
        const htmlRows = results[1].rows;
        // console.log(cssRows);
        // console.log(htmlRows);
  
        fs.readFile('../designDictionary/html/termDictionary.html', 'utf8', (err, htmlContent) => {
          if (err) {
            console.error('HTML読み込みエラー:', err);
            res.statusCode = 500;
            res.end('HTMLファイルの読み込みエラーが発生しました');
          } else {
            // CSSテーブルの作成
            let cssTableHTML = '<table>';
            cssTableHTML += '<tr><th>タグ</th><th>説明</th></tr>';
  
            cssRows.forEach((row) => {
              cssTableHTML += `<tr><td>${row.css_code}</td><td>${row.css_summary}</td></tr>`;
            });
  
            cssTableHTML += '</table>';
  
            // HTMLテーブルの作成
            let htmlTableHTML = '<table>';
            htmlTableHTML += '<thaed>';
            htmlTableHTML += '<tr><th>タグ</th><th>説明</th></tr>';
            htmlTableHTML += '<thaed>';
            htmlTableHTML += '<tbody>';
  
            htmlRows.forEach((row) => {
              htmlTableHTML += `<tr><td>${row.html_code}</td><td>${row.html_summary}</td></tr>`;
            });

            htmlTableHTML += '</tbody>';
            htmlTableHTML += '</table>';
  
            // レスポンスとしてHTMLを返す
            htmlContent = htmlContent.replace('{{cssTable}}', cssTableHTML);
            htmlContent = htmlContent.replace('{{htmlTable}}', htmlTableHTML);
  
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;
            res.end(htmlContent);
          }
        });
      })
      .catch(err => {
        console.error('エラーが発生しました', err);
        res.status(500).send('エラーが発生しました'); // エラーレスポンスを返す
      });
  });

  module.exports =router;

// サーバーの起動
// app.listen(8080, () => {
//   console.log('サーバーがポート8080で起動しました');
// });
