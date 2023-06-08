
const e = require('express');
var http = require('http');
var html = require('fs').readFileSync('../designDictionary/html/register.html');
var Account = [];
var id =0;

http.createServer(function(req, res){
    var data = '';
    var Account= [];
    var flag = false;
    var x = 0;
    if(req.method === 'GET'){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html);
      
    }else if(req.method === 'POST'){
        req
            .on('data', function(chunk){
                data += chunk;
                for(var i = 0;i <= data.length;i++){
                    console.log("変数dataの値は!" + data[i]);
                    if(flag === true){
                        console.log("if成功");
                            for(var j = i;j <= data.length;j++){
                              console.log("成功");
                            if(data[j] === "&" || j == data.length){
                                flag = false
                                console.log("d flag")
                                Account[x] = [data.substring(i,j)]
                                x++;
                                break;
                            }
                        }
                    }
                    if(data[i] === "="){
                        console.log("=成功");
                        flag = true;
                        continue;
                    }
                
                }
                console.log("変数dataの値は" + data);
                console.log(Account[0],Account[1],Account[2],Account[3]);
                InsData(Account);
            })
            .on('end', function(){
                console.log("データの受け取り完了");
                res.end(html);
            })
            
    }
}).listen(8080);

function InsData(Account){
    
    
const {Client} = require("pg");
const client = new Client({
    user: "postgres",//ユーザー名
    host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
    database: "postgres",//DB名
    password: "shirokuma123",//ユーザーパスワード
    port: 5432, 
});
client.connect();
console.log(Account[0],Account[1],Account[2],Account[3]);

const overlap = {
    text: "SELECT address,COUNT ($1) FROM user_info GROUP BY (address)",
    values:Account[0]
};

const query = {
    text: "INSERT INTO user_info( user_name, pwd, address) VALUES($3,$2,$1)",
values:[Account[0],Account[1],Account[3]]
   
};

client
    .query(overlap)
    .then((res) => {
    if(res===0){
        
        client.end();
    }
    else{
        indexDocument = indexDocument.replace('Gmail','Gmail 登録されたメールアドレスです' );
    console.log(res);
        
    }

})

client
    .query(query)
    .then((res) => {
        console.log(res);
        client.end();
    })
    .catch((e) => console.error(e.stack));
}