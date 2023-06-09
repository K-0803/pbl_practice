const http = require('http');
const notifier = require('node-notifier');
const express = require('express');

var html = require('fs').readFileSync('../designDictionary/html/login.html');
var resultArray = [];
var resultCnt = 0;
// var reditFlag = false;

http.createServer(function(req, res){
    var data = '';
    var data_test = [];
    var flag = false;
    var x = 0;

    if(req.method === 'GET'){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html);
    }else if(req.method === 'POST'){    
        req.on('data',function(chunk){
            data += chunk;
            console.log(data);
            for(var i = 0;i < data.length;i++){
                if(flag === true){
                    for(var j = i;j <= data.length;j++){
                        if(data[j] === "&" || j == data.length){
                            flag = false;
                            data_test[x] = [data.substring(i,j)];
                            console.log("変数dataの値は!" + data_test[x] +",xの中身は" + x);
                            x++;
                            break;
                        }
                    }
                }
                if(data[i] === "="){
                    flag = true;
                    continue;
                }

            }
            getPass(data_test[0], data_test[1]);

        })
    
           .on('end', function(){
            console.log('受け取り完了');
            res.end(html);
        })
    }
}).listen(8080,function(){
    console.log("server running!");
});

function getPass(email, pass){
    console.log(email);
    console.log(pass);
    const {Client} = require("pg");
    const client = new Client({
        user: "postgres",//ユーザー名
        host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
        database: "postgres",//DB名
        password: "shirokuma123",//ユーザーパスワード
        port: 5432, 
    });
    client.connect();
    const query = {
        text: "SELECT user_id from user_info where address = ($1) and pwd = ($2)",
        values: [email, pass],
    };

    client
        .query(query)
        .then((res) => {
            resultArray = res.rows;
            resultCnt = res.rowCount;
            if(resultCnt == 0){
                console.log("resultCnt = 0");
                notifier.notify({
                    title: "エラー通知",
                    message:"入力ミスがあります。再入力して下さい。"
                });
            }else{
                console.log("resultCnt != 0")
                res.redirect("/index.html");
                notifier.notify({
                    title: "ログイン通知",
                    message:`ようこそ${resultArray}さん`
                });
                
            }
            console.log(resultArray);
            client.end();
        })
        .catch((e) => console.error(e.stack));
}