const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const {Client} = require("pg");
const cookieParser = require('cookie-parser');
const puppeteer = require('puppeteer');
const router = express.Router();

// var html = require('fs').readFileSync('../designDictionary/html/customList.html');
// const router = require('../designDictionary/html/login.html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../designDictionary')));
app.use(express.json());

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../designDictionary', 'html', 'webCreate.html'));
});

router.post('/', function(req, res){
  //cookieに保存されているuserIdとuserNameを取得
  const cookieHeader = req.headers.cookie;
  var data={
    acc: {name:'',gmail:'',account:'log in',log:'<a href="/login" class="login">'}
  }
  if (cookieHeader) {
    const cookiePairs = cookieHeader.split(';');
    const cookieData = {};
    
    for (const cookiePair of cookiePairs) {
      const [name, value] = cookiePair.trim().split('=');
      cookieData[name] = decodeURIComponent(value);
    }
    const userid = cookieData['userId'];
    const username = cookieData['userName'];

    console.log("wCでのuserId確認:" + userid);


      //入力データの取得
      const {htmlContent, cssContent, comment} = req.body;

      //ファイル名を一意なIDとして生成
      const fileId = uuidv4();

      //HTMLファイルとCSSファイルを生成して保存
      
      const htmlFilePath = `../designDictionary/saveFile/html/${fileId}.html`;
      const cssFilePath = `../designDictionary/saveFile/css/${fileId}.css`;
      fs.writeFileSync(htmlFilePath, htmlContent);
      fs.writeFileSync(cssFilePath, cssContent);

      (async () => {

        try {
          // 新しいブラウザインスタンスを起動
          const Browser = await puppeteer.launch();
          
          // ブラウザのWSEndpointを取得
          const browserWSEndpoint = Browser.wsEndpoint();
          
          // WSEndpointを表示
          console.log('ブラウザのWSEndpoint:', browserWSEndpoint);
          
          // この時点で、browserWSEndpointを保存しておくことが重要です
          
          // 以下のようにして、後でWSEndpointを使ってブラウザにアタッチできます       
          const browser = await puppeteer.connect({browserWSEndpoint});
    
          // アタッチしたブラウザの最初のタブを取得
          const pages = await browser.pages();
          const page = pages[0];
          
          if (!page) {
            console.error('ブラウザにタブが見つかりませんでした。');
            await browser.close();
            return;
          }
          
          // 現在開かれているページのURLを取得
          const currentURL = page.url();
          console.log('現在開かれているページのURL:', currentURL);
          
          // 指定のURLを開く
          await page.goto('http://localhost:8080/webCreate');

          // ユーザーが入力したHTMLとCSSを取得
          const { htmlContent, cssContent } = req.body;
          console.log(htmlContent);
          console.log(cssContent);

          // ページにHTMLとCSSを適用
          await page.evaluate((htmlContent, cssContent) => {
            // ページのHTMLとCSSを入力した内容に置き換える
            document.querySelector('#view').innerHTML += htmlContent;
            document.querySelector('#view').innerHTML += `<style>${cssContent}</style>`;
          }, htmlContent, cssContent);
                
          // ページが完全に読み込まれるのを待つ（必要に応じて調整）
          await page.waitForTimeout(2000);
          
          // スクリーンショットを取得する要素を特定し、その位置とサイズを取得
          const element = await page.$('#view'); // ここにスクリーンショットを取得したい要素のセレクタを入力します
          const boundingBox = await element.boundingBox();
          
          if (!boundingBox) {
            console.error('指定された要素が見つかりませんでした。');
            await browser.close();
            return;
          }
          
          // スクリーンショットを取得
          await page.screenshot({
            path: `../designDictionary/saveFile/png/${fileId}.png`, // 保存先のファイル名
            clip: boundingBox // スクリーンショットを取得したい要素の位置とサイズを指定
          });
          
          console.log('スクリーンショットが保存されました。');

          // ブラウザを閉じる
          await browser.close();
          await Browser.close();
        } catch (error) {
          console.error('エラーが発生しました:', error);
        }
      
        console.log("スクリーンショット撮影");

      
        const client = new Client({
            user: "postgres",//ユーザー名
            host: "database-2.cgz0heptpctb.us-east-1.rds.amazonaws.com",//ホスト
            database: "postgres",//DB名
            password: "shirokuma123",//ユーザーパスワード
            port: 5432, 
        });
        client.connect();
        const query = {
          text: "INSERT INTO web_create (user_id, user_name, ccss_code, chtml_code, write_comment) VALUES ($1, $2, $3, $4, $5)",
          values: [userid, username, fileId, fileId, comment],
        };
        client.query(query, function(error, result){
          if(error){
            console.error('データベースエラー：', error);
            res.redirect('/html/index.html');
          }else{
            console.log('ファイルが生成され、データベースに保存されました');
            res.redirect('/html/webCreate.html');
          }
        });

      })();

    }else{
      res.render('mypage',data)
    }

})

module.exports =router;

// app.listen(8080, function(){
//   console.log('サーバーがポート8080で起動しました。');
// })
