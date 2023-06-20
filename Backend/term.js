const http = require('http');
const { Pool } = require('pg');
const fs = require('fs');

const path = require('path');   //相対パスを使用可能にする
const bodyParser = require('body-parser');  //req.bodyを使用できるようにする
const express = require('express');
const app = express();

//ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: false }));    //req.bodyを使用するためのミドルウェア
app.use(bodyParser.json());                             //
app.use(express.static(path.join('../designDictionary/html'))); //相対パスを使用するためのミドルウェア
app.use(express.json());

// データベースの接続情報
const dbConfig = {
    user: "postgres",//ユーザー名
    host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
    database: "postgres",//DB名
    password: "shirokuma123",//ユーザーパスワード
    port: 5432,
};
// データベース接続
const pool = new Pool(dbConfig);

//getリクエストの処理
app.get('/siteURL', function(req, res){

  //ページが開かれたときにhtmlを表示する処理
  const filePath = path.join('../designDictionary/html/searchResult.html');
  console.log(filePath);
  res.sendFile(filePath);

  res.end();
});

  app.post('/siteURL',function(req,res){
    const {search} = req.body;//リクエストボディのデータ取得
    //console.log("serchの中身は:"+search);
  //if文の条件を変更。キーワード入力エリアが空白でない場合に処理実行
  if (search != '') {
    
      //console.log("serchの中身は:"+search);

      // クエリの作成と実行
      const query = {
        text: 'SELECT css_code , css_summary FROM css_model WHERE css_code = $1',
        values: [search],
      };
    
      pool.query(query)
        .then(result => {
          const rows = result.rows;
          console.log(rows); // 検索結果をJSON形式でレスポンスとして返す
        })
        .catch(err => {
          console.error('エラーが発生しました', err);
          res.status(500).send('エラーが発生しました'); // エラーレスポンスを返す
        });
      
   

    // クエリを実行し、結果を取得
    pool.query(query, (err, result) => {
      if (err) {
        console.error('クエリエラー:', err);
        res.statusCode = 500;
        res.end('データベースエラーが発生しました');
      } else {
        fs.readFile('../designDictionary/html/searchResult.html', 'utf8', (err, htmlContent) => {
          if (err) {
            console.error('HTML読み込みエラー:', err);
            res.statusCode = 500;
            res.end('HTMLファイルの読み込みエラーが発生しました');
          } else {
            // HTMLテーブルの作成
            let tableHTML = '<table border="1">';
            tableHTML += '<tr><th>カラーコード</th><th>説明</th></tr>';

            result.rows.forEach((row) => {
              tableHTML += `<tr><td>${row.css_code}</td><td>${row.css_summary}</td></tr>`;
            });

            tableHTML += '</table>';

            // レスポンスとしてHTMLを返す
            htmlContent = htmlContent.replace('{{table}}', tableHTML);
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;
            res.end(htmlContent);
          }
        });
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});
// サーバーの起動
app.listen(8080, () => {
  console.log('サーバーがポート8080で起動しました');
});




// HTTPサーバーの作成
// const server = http.createServer((req, res) => {
//   if (req.url === '/') {
//     // データベースからデータを取得するクエリ
//     const query = 'SELECT * FROM css_model';

//     // クエリを実行し、結果を取得
//     pool.query(query, (err, result) => {
//       if (err) {
//         console.error('クエリエラー:', err);
//         res.statusCode = 500;
//         res.end('データベースエラーが発生しました');
//       } else {
//         fs.readFile('../designDictionary/html/searchResult.html', 'utf8', (err, htmlContent) => {
//           if (err) {
//             console.error('HTML読み込みエラー:', err);
//             res.statusCode = 500;
//             res.end('HTMLファイルの読み込みエラーが発生しました');
//           } else {
//             // HTMLテーブルの作成
//             let tableHTML = '<table>';
//             tableHTML += '<tr><th>カラーコード</th><th>説明</th></tr>';

//             result.rows.forEach((row) => {
//               tableHTML += `<tr><td>${row.css_code}</td><td>${row.css_summary}</td></tr>`;
//             });

//             tableHTML += '</table>';

//             // レスポンスとしてHTMLを返す
//             htmlContent = htmlContent.replace('{{table}}', tableHTML);
//             res.setHeader('Content-Type', 'text/html');
//             res.statusCode = 200;
//             res.end(htmlContent);
//           }
//         });
//       }
//     });
//   } else {
//     res.statusCode = 404;
//     res.end('Not Found');
//   }
// });

// // サーバーの起動
// server.listen(8080, () => {
//   console.log('サーバーがポート8080で起動しました');
// });
