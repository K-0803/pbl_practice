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

// app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../designDictionary/html/views'));
// app.engine('ejs', require('ejs').__express);

const client = new Client({
    user: "postgres",//ユーザー名
    host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
    database: "postgres",//DB名
    password: "shirokuma123",//ユーザーパスワード
    port: 5432,
});

router.get('/', function(req, res){
    const filePath = path.join(__dirname, '../designDictionary/html/customList.html');
    console.log(filePath);
    res.sendFile(filePath);
    res.end();
})

router.post('/', function(req, res){
    const userName = req.cookies.userName;
    //デバッグ用userId
    // const userId = 1;

    const query = {
        text: "SELECT chtml_code from web_create order by ($1) asc",
        values: [userName],
    };
    client.connect();
    client
        .query(query)
        .then(function(result){
            console.log(result);
            const resultArray = result.rows;

            const htmlCodes = resultArray.map(value => value.chtml_code );
            
            const pngTags = [];
            
            const readFilePromises = htmlCodes.map(function(htmlId){
                // const pngFilePath = path.join(__dirname, `../designDictionary/saveFile/png/${htmlId}.png`);
                
                return Promise.all(htmlId)
                    .then(function(){
                        let pngTag = `<div class="htmlCode" oninput="preview" name="${htmlId}"><a href="postDetails.html"><img src="../saveFile/png/${htmlId}.png" alt="ここに画像が入る"></a>`;
                        pngTag += `<input type="submit" value="詳細を見る"></div><br>`
                        pngTags.push(pngTag);
                        // cssTags.push(cssTag);
                    })
                    .catch(function(err){
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                    });
            })

            // const readFilePromises = htmlCodes.map(function(htmlCode, index){
            //     const htmlFilePath = `../designDictionary/saveFile/html/${htmlCode}.html`;
            //     const cssFilePath = `../designDictionary/saveFile/css/${cssCodes[index]}.css`;

            //     return Promise.all([
            //         fs.promises.readFile(htmlFilePath, 'utf8'),
            //         fs.promises.readFile(cssFilePath, 'utf8')
            //     ])
            //         .then(function([htmlContent, cssContent]){
            //             let htmlTag = `<div class="viewArea${index}" contenteditable="true"></div><br>
            //                             <div class="htmlCode" oninput="preview">${htmlContent}`;
            //             htmlTag += `<style>${cssContent}</style></div>`;
            //             htmlTags.push(htmlTag);
            //             // cssTags.push(cssTag);
            //         })
            //         .catch(function(err){
            //             console.error(err);
            //             res.status(500).send('Internal Server Error');
            //         });
            // });

            Promise.all(readFilePromises)
                .then(function(){
                    fs.readFile('../designDictionary/html/customList.html', 'utf8', function(err, originContent){
                        if(err){
                            console.error(err);
                            res.statusCode = 500;
                            res.end();
                        }else{
                            const renderedHTML = pngTags.join('');
                            // const renderedCSS = cssTags.join('');
                            console.log(originContent);
                            htmlTxt = originContent.replace('{{customhtml}}', renderedHTML)
                            // .replace('</head>', `${renderedCSS}\n</head>`);

                            // fs.writeFile(filePath, modifiedHtmlContent, htmlTxt, 'utf8', (err) =>{
                            //     if(err){
                            //         console.error(err);
                            //         return;
                            //     }
                            // })
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
            
})

module.exports =router;

// app.listen(8080, function(){
//     console.log("サーバーがポート8080で起動しました。");
// })

