// const http = require('http');
const notifier = require('node-notifier');
// const fs = require('fs');
const express = require('express');
const path = require('path');   //相対パスを使用可能にする
const bodyParser = require('body-parser');  //req.bodyを使用できるようにする
const app = express();
const cookieParser = require('cookie-parser');
const port = 80;
const router = express.Router();

var html = require('fs').readFileSync('../designDictionary/html/login.html');
var resultArray = [];
var resultCnt = 0;
var resultId = null;
// var reditFlag = false;

//ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: false }));    //req.bodyを使用するためのミドルウェア
app.use(bodyParser.json());                             //
app.use(express.static(path.join('../designDictionary'))); 
app.use(express.json());
app.use(cookieParser());

//getリクエストの処理・ページを開いたときにhtmlが表示される
router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../designDictionary', 'html', 'login.html'));
});

//postリクエストの処理
router.post('/', function(req, res){
    const {email, pass} = req.body; //リクエストボディのデータ取得

    getPass(email, pass)
        .then(function(redId){
            if (redId != null) {
                res.cookie('userId', redId);
                console.log("userIdは" + redId);
                res.redirect('/html/index.html');
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

// app.listen(8080, function(){
//     console.log("aaaaa!");
// })

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
                console.log(res);
                resultCnt = res.rowCount;
                if(resultCnt == 0){
                    console.log("resultCnt = 0");
                    resultId = null;
                    redct = 'error';
                    notifier.notify({
                        title: "エラー通知",
                        message:"入力ミスがあります。再入力して下さい。"
                    });
                }else{
                    resultArray = res.rows[0].user_name;
                    resultId = res.rows[0].user_id;
                    console.log("resultCnt != 0")
                    notifier.notify({
                        title: "ログイン通知",
                        message:`ようこそ${resultArray}さん`
                    });
                    
                }
                console.log(resultId);

                client.end();
                resolve(resultId);
            })
            .catch(function(e){
                console.error(e.stack);
                reject(e);
            });
    });
    
}

module.exports =router;
// function getPass(email, pass){
//     const {Client} = require("pg");
//     const client = new Client({
//         user: "postgres",//ユーザー名
//         host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
//         database: "postgres",//DB名
//         password: "shirokuma123",//ユーザーパスワード
//         port: 5432, 
//     });

//     return new Promise(function(resolve, reject){
//         client
//             .connect()
//             .then(function(){
//                 const query = {
//                     text: "SELECT user_id, user_name from user_info where address = ($1) and pwd = ($2)",
//                     values: [email, pass],
//                 };

                
//                 return client.query(query);
//             })
//             .then(function(res){
                
//                 resultCnt = res.rowCount;
//                 if(resultCnt == 0){
//                     console.log("resultCnt = 0");
//                     redct = 'error';
//                     notifier.notify({
//                         title: "エラー通知",
//                         message:"入力ミスがあります。再入力して下さい。"
//                     });
//                 }else{
//                     resultArray = res.rows[0].user_name;
//                     console.log("resultCnt != 0")
//                     redct = '/redirect';
//                     notifier.notify({
//                         title: "ログイン通知",
//                         message:`ようこそ${resultArray}さん`
//                     });
                    
//                 }
//                 console.log(resultArray);
//                 console.log(redct);
//                 client.end();
//                 resolve(redct);
//             })
//             .catch(function(e){
//                 console.error(e.stack);
//                 reject(e);
//             });
//     });
    
// }