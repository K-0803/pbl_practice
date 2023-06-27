const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const path = require('path');   //相対パスを使用可能にする
const bodyParser = require('body-parser');  //req.bodyを使用できるようにする

var html = require('fs').readFileSync('../designDictionary/html/customList.html');
const {Client} = require("pg");

//ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: false }));    //req.bodyを使用するためのミドルウェア
app.use(bodyParser.json());                             //
app.use(express.static(path.join('../designDictionary'))); 
app.use(express.json());
app.use(cookieParser());

// app.set('view engine', 'ejs');

const client = new Client({
    user: "postgres",//ユーザー名
    host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
    database: "postgres",//DB名
    password: "shirokuma123",//ユーザーパスワード
    port: 5432,
});

app.get('/customList', function(req, res){
    // const filePath = path.join('../designDictionary/html/customList.html');
    // console.log(filePath);
    // const userId = req.cookies.userId;
    //デバッグ用userId
    const userId = 1;
    console.log(userId);

    const query = {
        text: "SELECT chtml_code, ccss_code from web_create where user_id = ($1)",
        values: [userId],
    };
    client.connect();
    client
        .query(query)
        .then(function(res){
            console.log(res);
            res.rows.foreach(function(value){
                const htmlCode = value.chtml_code;
                const cssCode = value.ccss_code;

                
            })
            // HTMLテンプレートとCSSテンプレートを作成してデータを埋め込む

            // レスポンスとしてHTMLを返す
            res.render('index', {renderedHTML, renderedCSS});

            res.end(html);
        })
        .catch(function(e){
            res.end();
        })
})

app.listen(8080, function(){
    console.log("サーバーがポート8080で起動しました。");
})
