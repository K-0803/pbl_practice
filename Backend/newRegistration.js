
var http = require('http');
var html = require('fs').readFileSync('register.html');
var Account = [GmailTxt,passTxt,repassTxt,UserArea];

http.createServer(function(req, res){
    
    var flag = false;
    if(req.method === 'GET'){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html);
      
    }else if(req.method === 'POST'){
        req
            .on('data', function(chunk){
                data += chunk;
                for(var i = 0;i <= data.length;i++){
                    if(flag === true){
                            for(var j = i;j <= data.length;j++){
                              
                            if(data[j] === "&" || j == data.length){
                                flag = false
                                console.log("d flag")
                                Account[x] = [data.substring(i,j)]
                                x++;
                                break;
                            }
                      
                    }
                    if(data[i] === "="){
                        flag = true;
                        continue;
                    }
                }
                }
                console.log("変数dataの値は" + data);
                InsData();
            })
            .on('end', function(){
                console.log("データの受け取り完了");
                res.end(html);
            })

    }
}).listen(8080);

function InsData(){

const {Client} = require("pg");
const client = new Client({
    user: "postgres",//ユーザー名
    host: "database-springfw1.ccscu6v1ahrd.us-east-1.rds.amazonaws.com",//ホスト
    database: "postgres",//DB名
    password: "shirokuma123",//ユーザーパスワード
    port: 5432, 
});
client.connect();
const query = {
    text: "INSERT INTO pbltest(text) Gmail($1),pass($2),repass($3),user($4)",
    // Account.forEach(function(i) {
    //     console.log(week);
    //   });
    Gmail: Account[0],
    pass: Account[1],
    repass: Account[2],
    user: Account[3]
};

client
    .query(query)
    .then((res) => {
        console.log(res);
        client.end();
    })
    .catch((e) => console.error(e.stack));
}