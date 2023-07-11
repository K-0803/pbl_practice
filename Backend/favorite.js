const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');   //相対パスを使用可能にする
const bodyParser = require('body-parser');  //req.bodyを使用できるようにする
const router = express.Router();

var html = require('fs').readFileSync('../designDictionary/html/favorite.html');

//ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: false }));    //req.bodyを使用するためのミドルウェア
app.use(bodyParser.json());                             //
app.use(express.static(path.join('../designDictionary'))); 
app.use(express.json());
app.use(cookieParser());

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../designDictionary', 'html', 'favorite.html'));
})

router.post('/', function(req, res){
    const userId = req.cookies.userId;
})

module.exports =router;