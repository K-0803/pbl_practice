const express = require('express');
const http = require('http');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


// Node.jsファイル1
app.use('/', require('./index')); //indexページ遷移
app.use('/search', require('./term'));  //検索結果ページ遷移
app.use('/termDictionary', require('./termDictionary'));  //用語辞典ページ遷移
app.use('/generate', require('./webCreate'));  //ウェブ作成ページ遷移
app.use('/favorite', require('./favorite'));  //お気に入りページ遷移
app.use('/regiater', require('./register'));  //新規登録ページ遷移
app.use('/customList', require('./customList'));  //カスタムリストページ遷移
app.use('/Wtemplate', require('./Wtemplate'));  //ログインページ遷移
app.use('/webCreate', require('./webCreate'));  //ログインページ遷移
app.use('/Ptemplate', require('./Ptemplate'));  //ログインページ遷移
app.use('/postLog', require('./postLog'));  //ログインページ遷移
app.use('/colorSample', require('./colorSample.js'));  //ログインページ遷移
app.use('/customLog', require('./customLog'));  //ログインページ遷移
app.use('/mypage', require('./mypage'));  //ログインページ遷移
app.use('/postDetails', require('./postDetails'));  //ログインページ遷移



const server = http.createServer(app);
server.listen(8080); // ポート番号は必要に応じて変更