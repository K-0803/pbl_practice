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
// var reditFlag = false;

//ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: false }));    //req.bodyを使用するためのミドルウェア
app.use(bodyParser.json());                             //
app.use(express.static(path.join('../designDictionary/html'))); //相対パスを使用するためのミドルウェア
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

app.listen(port,'107.22.226.32' ,()=>{
    console.log('サーバーがポート8080で起動しました。');
})


// http.createServer(function(req, res){
//     var data = '';
//     var data_test = [];
//     var flag = false;
//     var x = 0;
//     // var result = '';

//     if(req.method === 'GET'){
//         res.writeHead(200, {'Content-Type' : 'text/html'});
//         res.end(html);
//     }else if(req.method === 'POST'){    
//         req.on('data',function(chunk){
//             data += chunk;
//             console.log(data);
//             for(var i = 0;i < data.length;i++){
//                 if(flag === true){
//                     for(var j = i;j <= data.length;j++){
//                         if(data[j] === "&" || j == data.length){
//                             flag = false;
//                             data_test[x] = data.substring(i,j);
//                             console.log("変数dataの値は!" + data_test[x] +",xの中身は" + x);
//                             x++;
//                             break;
//                         }
//                     }
//                 }
//                 if(data[i] === "="){
//                     flag = true;
//                     continue;
//                 }

//             }

//             getPass(data_test[0], data_test[1])
//                 .then(function(redUrl){
//                     console.log('値は=' + redUrl);
//                     if (redUrl === '/redirect') {
//                         res.writeHeader(302, { Location: '../designDictionary/html/index.html' });
//                         res.end();
//                     } else {
//                         res.end(html);
//                     }
//                     })
//                 .catch((error) => {
//                     console.error(error);
//                     res.end(html);
//                 });
                

//         })
    
//            .on('end', function(){
//             console.log('受け取り完了');
//             res.end(html);
//         })
//     }
// }).listen(8080,function(){
//     console.log("server running!");
// });

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