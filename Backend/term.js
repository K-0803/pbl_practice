const http = require('http');
const { Pool } = require('pg');
const fs = require('fs');

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

// HTTPサーバーの作成
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // データベースからデータを取得するクエリ
    const query = 'SELECT * FROM css_model';

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
            let tableHTML = '<table>';
            tableHTML += '<tr><th>カラム1</th><th>カラム2</th></tr>';

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
server.listen(8080, () => {
  console.log('サーバーがポート8080で起動しました');
});
