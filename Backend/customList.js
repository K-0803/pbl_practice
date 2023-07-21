const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const fs = require('fs');
// const ejs = require('ejs');
const path = require('path');   //相対パスを使用可能にする
const bodyParser = require('body-parser');  //req.bodyを使用できるようにする
const router = express.Router();

var html = require('fs').readFileSync('../designDictionary/html/customList.html');
const {Client} = require("pg");

//ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: false }));    //req.bodyを使用するためのミドルウェア
app.use(bodyParser.json());                             //
app.use(express.static(path.join('../designDictionary'))); 
app.use(express.json());
app.use(cookieParser());

app.set('views', path.join(__dirname, '../designDictionary/html/views'));


router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../designDictionary', 'html', 'customList.html'));
})

router.post('/', function(req, res){
    // const userName = req.cookies.userName;

    async function executeDBOperations(){
        const client = new Client({
            user: "postgres",//ユーザー名
            host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
            database: "postgres",//DB名
            password: "shirokuma123",//ユーザーパスワード
            port: 5432,
        });

        const query = {
            text: "SELECT chtml_code from web_create order by user_name asc",
            // values: [userName],
        };
        
        await client.connect();
        client
            .query(query)
            .then(function(result){
                console.log(result);
                const resultArray = result.rows;
                
                const htmlCodes = resultArray.map(value => value.chtml_code );

                const customTags = [];

                const readFilePromises = htmlCodes.map(function(htmlCode){
                    const htmlId = `../saveFile/png/${htmlCode}.png`;

                    return Promise.all([htmlId, htmlCode])
                        .then(function(){
                            let htmlTag = `<form action="/postDetails" method="post">
                                        <div class="createView" id="imgId">
                                        <input type="hidden" name="htmlCode" value="${htmlCode}">
                                        <img src="${htmlId}" alt="WEBカスタム画像">
                                        <input type="submit" value="詳細を見る">
                                        </div>
                                        </form>`;
                            htmlTag += `<input type="submit"><label id="star">★</label><br>`;
                            customTags.push(htmlTag);
                            // cssTags.push(cssTag);
                        })
                        .catch(function(err){
                            console.error(err);
                            res.status(500).send('Internal Server Error');
                        });
                });

                Promise.all(readFilePromises)
                    .then(function(){
                        fs.readFile('../designDictionary/html/customList.html', 'utf8', function(err, originContent){
                            if(err){
                                console.error(err);
                                res.statusCode = 500;
                                res.end();
                            }else{
                                const renderedHTML = customTags.join('');
                                
                                const htmlTxt = originContent.replace('{{customhtml}}', renderedHTML)
                                // .replace('</head>', `${renderedCSS}\n</head>`);

                                res.setHeader('Content-Type', 'text/html');
                                res.statusCode = 200;
                                res.end(htmlTxt);
                            }
                        });
                    })
                    .catch(function(err){
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                    });
            })
            .catch(function(e){
                console.error(e);
                res.status(500).send('Internal Server Error');
            })
            .finally(function(){
                client.end();
            })
    }       
    
    executeDBOperations();
    
});

module.exports =router;

// app.listen(8080, function(){
//     console.log("サーバーがポート8080で起動しました。");
// })

