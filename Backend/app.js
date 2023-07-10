const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const path = require("path");


app.use(express.static(path.join(__dirname, '../designDictionary')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../designDictionary/html/views'));



// Node.jsファイル1
app.use('/', require('./index')); //indexページ遷移
app.use('/search', require('./term'));  //検索結果ページ遷移
app.use('/termDictionary', require('./termDictionary'));  //用語辞典ページ遷移
app.use('/generate', require('./webCreate'));  //ウェブ作成ページ遷移
app.use('/favorite', require('./favorite'));  //お気に入りページ遷移
app.use('/register', require('./register'));  //新規登録ページ遷移
app.use('/login', require('./loginProcess'));  //ログインページ遷移
app.use('/customList', require('./customList'));  //カスタムリストページ遷移
app.use('/Wtemplate', require('./Wtemplate'));  //webテンプレートページ遷移
app.use('/webCreate', require('./webCreate'));  //web作成ページ遷移
app.use('/Ptemplate', require('./Ptemplate'));  //パワーポイントテンプレートページ遷移
app.use('/postLog', require('./postLog'));  //投稿履歴ページ遷移
app.use('/colorSample', require('./colorSample'));  //カラーサンプルページ遷移
app.use('/customLog', require('./customLog'));  //カスタム履歴ページ遷移
app.use('/mypage', require('./mypage'));  //マイページ遷移
app.use('/postDetails', require('./postDetails'));  //投稿履歴詳細ページ遷移



const server = http.createServer(app);
server.listen(8080, function() {
  console.log('サーバーがポート8080で起動しました。');
});