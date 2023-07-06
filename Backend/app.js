const express = require('express');
const http = require('http');

const app = express();


// Node.jsファイル1
app.use('/', require('./index')); //indexページ遷移
app.use('/search', require('./term'));  //検索結果ページ遷移
app.use('/termDictionary', require('./termDictionary'));  //用語辞典ページ遷移
app.use('/generate', require('./webCreate'));  //ウェブ作成ページ遷移
app.use('/favorite', require('./favorite'));  //お気に入りページ遷移
app.use('/regiater', require('./register'));  //新規登録ページ遷移
app.use('/customList', require('./customList'));  //カスタムリストページ遷移
app.use('/login', require('./loginProcess'));  //ログインページ遷移




const server = http.createServer(app);
server.listen(8080); // ポート番号は必要に応じて変更