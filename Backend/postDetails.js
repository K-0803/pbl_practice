const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

app.use(express.static('public'));

// ホームページの表示
app.get('/', (req, res) => {
    const filePath = path.join(__dirname,'../designDictionary' ,'html','postDetails.html');
  res.sendFile(filePath);
});

app.post('/', function(req, res){
  // const userId = req.cookies.userId;
  //デバッグ用userId
  const userId = 1;

  const query = {
      text: "SELECT chtml_code, ccss_code from web_create where user_id = ($1)",
      values: [userId],
  };
  client.connect();
  client
      .query(query)
      .then(function(result){
          console.log(result);
          const resultArray = result.rows;

          const htmlCodes = resultArray.map(value => value.chtml_code );
          const cssCodes = resultArray.map(value => value.ccss_code );

          const htmlTags = [];
          const cssTags = [];

          const readFilePromises = htmlCodes.map(function(htmlCode, index){
              const htmlFilePath = `../designDictionary/saveFile/html/${htmlCode}.html`;
              const cssFilePath = `../designDictionary/saveFile/css/${cssCodes[index]}.css`;

              return Promise.all([
                  fs.promises.readFile(htmlFilePath, 'utf8'),
                  fs.promises.readFile(cssFilePath, 'utf8')
              ])
                  .then(function([htmlContent, cssContent]){
                      let htmlTag = `<div class="viewArea${index}" contenteditable="true"></div><br>
                                      <div class="htmlCode" oninput="preview">${htmlContent}`;
                      htmlTag += `<style>${cssContent}</style></div>`;
                      htmlTags.push(htmlTag);
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
                          const renderedHTML = htmlTags.join('');
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