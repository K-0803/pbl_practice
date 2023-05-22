var http = require('http');
var html = require('fs').readFileSync('神経衰弱.html');


http.createServer(function(req, res){
    var data = '';
    var textArea = '';
    var nameTxt = '';
    var passTxt = '';
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
                        
                    }
                    if(data[i] === "="){
                        flag = true;
                        continue;
                    }

                }
                console.log("変数dataの値は" + data);
                InsData(data);
            })
            .on('end', function(){
                console.log("データの受け取り完了");
                res.end(html);
            })

    }
}).listen(8080);

function InsData(data){

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
    text: "INSERT INTO pbltest(text) VALUES ($1)",
    values: [data],
};

client
    .query(query)
    .then((res) => {
        console.log(res);
        client.end();
    })
    .catch((e) => console.error(e.stack));
}