
var http = require('http');
var html = require('fs').readFileSync('../designDictionary/html/register.html');
var Account = [];

http.createServer(function(req, res){



const {Client} = require("pg");
const client = new Client({
    user: "postgres",//ユーザー名
    host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
    database: "postgres",//DB名
    password: "shirokuma123",//ユーザーパスワード
    port: 5432, 
});
client.connect();
const  query = client.query("select * from css_model;",

     function(err, result) {

    res.write('<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><head></head><body><table border="5" frame="box">');

    for(lc = 0; lc < result.rows.length; lc++){

        res.write('<tr class="border">');
        res.write("<td>"+result.rows[lc].id+"</td>" ); 
        res.write("<td>"+result.rows[lc].css_code+"</td>" ); 
        res.write("<td>"+result.rows[lc].css_summary+"</td>" ); 

        res.write('</tr>');

    }

    res.end('</table></body></html>')

});

        
}).listen(8080);



