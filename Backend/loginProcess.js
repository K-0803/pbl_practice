// const http = require('http');
const notifier = require('node-notifier');
// const fs = require('fs');
const express = require('express');
const path = require('path');   //相対パスを使用可能にする
const bodyParser = require('body-parser');  //req.bodyを使用できるようにする
const app = express();
const port = 80;

var html = require('fs').readFileSync('../designDictionary/html/login.html');
var resultArray = [];
var resultCnt = 0;
var resultId = 0;
// var reditFlag = false;

//ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: false }));    //req.bodyを使用するためのミドルウェア
app.use(bodyParser.json());                             //
app.use(express.static(path.join('../designDictionary'))); 
app.use(express.json());

//getリクエストの処理・ページを開いたときにhtmlが表示される
app.get('/login', function(req, res){
    const filePath = path.join('../designDictionary/html/login.html');
    console.log(filePath);
    res.sendFile(filePath);
    res.end();
});

//postリクエストの処理
app.post('/login', function(req, res){
    const {email, pass} = req.body; //リクエストボディのデータ取得
    console.log(email);
    console.log(pass);

    getPass(email, pass)
        .then(function(redUrl){
            console.log('値は=' + redUrl);
            if (redUrl === '/redirect') {
                res.redirect(req.baseUrl + '/index.html');
                res.end();
            } else {
                res.end(html);
            }
            })
        .catch((error) => {
            console.error(error);
            res.end(html);
        });
    
})


// app.listen(port,'107.22.226.32' ,()=>{
//     console.log('サーバーが起動しました。');
// })

app.listen(8080, function(){
    console.log("aaaaa!");
})

function getPass(email, pass){
    const {Client} = require("pg");
    const client = new Client({
        user: "postgres",//ユーザー名
        host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
        database: "postgres",//DB名
        password: "shirokuma123",//ユーザーパスワード
        port: 5432, 
    });

    return new Promise(function(resolve, reject){
        client
            .connect()
            .then(function(){
                const query = {
                    text: "SELECT user_id, user_name from user_info where address = ($1) and pwd = ($2)",
                    values: [email, pass],
                };

                
                return client.query(query);
            })
            .then(function(res){
                // console.log(res);
                resultCnt = res.rowCount;
                if(resultCnt == 0){
                    console.log("resultCnt = 0");
                    redct = 'error';
                    notifier.notify({
                        title: "エラー通知",
                        message:"入力ミスがあります。再入力して下さい。"
                    });
                }else{
                    resultArray = res.rows[0].user_name;
                    resultId = res.rows[0].user_id;
                    console.log("resultCnt != 0")
                    redct = '/redirect';
                    notifier.notify({
                        title: "ログイン通知",
                        message:`ようこそ${resultArray}さん`
                    });
                    
                }
                console.log(resultArray);
                console.log(resultId);
                console.log(redct);
                client.end();
                resolve(redct, resultId);
            })
            .catch(function(e){
                console.error(e.stack);
                reject(e);
            });
    });
    
}

function getPass(email, pass){
    const {Client} = require("pg");
    const client = new Client({
        user: "postgres",//ユーザー名
        host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
        database: "postgres",//DB名
        password: "shirokuma123",//ユーザーパスワード
        port: 5432, 
    });

    return new Promise(function(resolve, reject){
        client
            .connect()
            .then(function(){
                const query = {
                    text: "SELECT user_id, user_name from user_info where address = ($1) and pwd = ($2)",
                    values: [email, pass],
                };

                
                return client.query(query);
            })
            .then(function(res){
                
                resultCnt = res.rowCount;
                if(resultCnt == 0){
                    console.log("resultCnt = 0");
                    redct = 'error';
                    notifier.notify({
                        title: "エラー通知",
                        message:"入力ミスがあります。再入力して下さい。"
                    });
                }else{
                    resultArray = res.rows[0].user_name;
                    console.log("resultCnt != 0")
                    redct = '/redirect';
                    notifier.notify({
                        title: "ログイン通知",
                        message:`ようこそ${resultArray}さん`
                    });
                    
                }
                console.log(resultArray);
                console.log(redct);
                client.end();
                resolve(redct);
            })
            .catch(function(e){
                console.error(e.stack);
                reject(e);
            });
    });
    
}