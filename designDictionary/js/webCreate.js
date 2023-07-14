document.addEventListener("DOMContentLoaded", function() {
    var colorA = { red: 216, green: 216, blue: 216 };

});
            //初期化ボタンの処理
            function resetTextAreas() {
                var htmlTextArea = document.getElementById("code");
                var cssTextArea = document.getElementById("ccode");

                htmlTextArea.value = ""; // HTMLテキストエリアの内容を初期化
                cssTextArea.value = ""; // CSSテキストエリアの内容を初期化
            }

            // 初期選択の色AのRGB値を取得
            var selectedColor = document.getElementById("color-select").value.split(",").map(Number);
            var colorA = {
                red: selectedColor[0],
                green: selectedColor[1],
                blue: selectedColor[2]
            };

            // 反対色Bと中間色Cを計算する関数
            function calculateColors() {
              // 反対色Bを計算
              if (colorA.red !== 216 && colorA.green !== 216 && colorA.blue !== 216) {
              var colorB = {
                red: 255 - colorA.red,
                green: 255 - colorA.green,
                blue: 255 - colorA.blue
              };}else{
                var colorB={ red: 216, green: 216, blue: 216 };
              }
              
              // 中間色Cを計算
              if (colorA.red !== 216 && colorA.green !== 216 && colorA.blue !== 216) {
              var colorC = {
                red: Math.round((colorA.red + colorB.red) / 2),
                green: Math.round((colorA.green + colorB.green) / 2),
                blue: Math.round((colorA.blue + colorB.blue) / 2)
              };}else{
                var colorC={ red: 216, green: 216, blue: 216 };
              }
              
              // 結果を表示

              document.getElementById("colorA").textContent = "色A" + getColorCode(colorA);
              document.getElementById("colorA").style.color = "rgb(" + colorA.red + ", " + colorA.green + ", " + colorA.blue + ")";

              document.getElementById("colorB").textContent = "反対色B"+ getColorCode(colorB);
              document.getElementById("colorB").style.color = "rgb(" + colorB.red + ", " + colorB.green + ", " + colorB.blue + ")";

              document.getElementById("colorC").textContent = "中間色C"+ getColorCode(colorB);
              document.getElementById("colorC").style.color = "rgb(" + colorC.red + ", " + colorC.green + ", " + colorC.blue + ")";

              optionA.style.backgroundColor = "rgb(" + colorA.red + ", " + colorA.green + ", " + colorA.blue + ")";
                optionA.style.color = "rgb(" + colorA.red + ", " + colorA.green + ", " + colorA.blue + ")";
                optionA.value = "rgb(" + colorA.red + ", " + colorA.green + ", " + colorA.blue + ")";

                optionB.style.backgroundColor = "rgb(" + colorB.red + ", " + colorB.green + ", " + colorB.blue + ")";
                optionB.style.color = "rgb(" + colorB.red + ", " + colorB.green + ", " + colorB.blue + ")";
                optionB.value = "rgb(" + colorB.red + ", " + colorB.green + ", " + colorB.blue + ")";

                optionC.style.backgroundColor = "rgb(" + colorC.red + ", " + colorC.green + ", " + colorC.blue + ")";
                optionC.style.color = "rgb(" + colorC.red + ", " + colorC.green + ", " + colorC.blue + ")";
                optionC.value = "rgb(" + colorC.red + ", " + colorC.green + ", " + colorC.blue + ")";
            }

            // プルダウンの選択が変更された時に呼ばれる関数
            function updateColors() {
              // 選択された色AのRGB値を更新
              var selectedColor = document.getElementById("color-select").value.split(",").map(Number);
              colorA.red = selectedColor[0];
              colorA.green = selectedColor[1];
              colorA.blue = selectedColor[2];

              // 反対色Bと中間色Cを再計算して表示
              calculateColors();
            }

            // 初期表示時に色を計算して表示
            document.addEventListener("DOMContentLoaded", function() {
              calculateColors();
            });

            // カラーコードを取得する関数
            function getColorCode(color) {
             var red = color.red.toString(16).padStart(2, "0");
             var green = color.green.toString(16).padStart(2, "0");
             var blue = color.blue.toString(16).padStart(2, "0");
             return "#" + red + green + blue;
            }

            var colorCircleClass = "color-circle";
            //プルダウン内のカラーを変動させるためのコード
            // var colorSelect = document.getElementById("colorSelect");
            // colorSelect.addEventListener("change", updatColors);

            //プルダウンメニューを反映する場合
    //         document.addEventListener("DOMContentLoaded", function() {
    //     var selectElement = document.getElementById("sentence");
    //     var inputElement = document.getElementById("code");

    //     selectElement.addEventListener("change", function() {
    //         var selectedValue = selectElement.value;
    //         var prefix = "<p> ";
    //         var suffix = " </p>";
    //         var modifiedValue = prefix + selectedValue + suffix;

    //         inputElement.value += modifiedValue;
    //         selectElement.selectedIndex = 0; // 選択肢の初期化
    //     });
    // });
    function sentenceValue() {
        var selectElement = document.getElementById("sentence");
     var inputElement = document.getElementById("code");
    var selectedValue = selectElement.value;
    
    // 選択された文に基づく処理を実行する
    if (selectedValue === "働くか死ぬか、それが問題だ。") {
       var prefix = "<p> ";
        var suffix = " </p>";
        var modifiedValue = prefix + selectedValue + suffix;

        inputElement.value += modifiedValue;
        selectElement.selectedIndex = 0; // 選択肢の初期化

            } else if (selectedValue === "be , or not to be , that is the question.") {
                var prefix = "<p> ";
        var suffix = " </p>";
        var modifiedValue = prefix + selectedValue + suffix;

        inputElement.value += modifiedValue;
        selectElement.selectedIndex = 0; // 選択肢の初期化

            } else if (selectedValue === "納得はすべてに優先される。") {
                var prefix = "<p> ";
        var suffix = " </p>";
        var modifiedValue = prefix + selectedValue + suffix;

        inputElement.value += modifiedValue;
        selectElement.selectedIndex = 0; // 選択肢の初期化

            } else if (selectedValue === "Conviction trumps all.") {
                var prefix = "<p> ";
        var suffix = " </p>";
        var modifiedValue = prefix + selectedValue + suffix;

        inputElement.value += modifiedValue;
        selectElement.selectedIndex = 0; // 選択肢の初期化

            } else if (selectedValue === "この社会には変革が必要だ。") {
            var prefix = "<p> ";
        var suffix = " </p>";
        var modifiedValue = prefix + selectedValue + suffix;

        inputElement.value += modifiedValue;
        selectElement.selectedIndex = 0; // 選択肢の初期化

            }
        }

            //フォントを反映
            function setFont() {
            var selectElement = document.getElementById("myfont");
            var textBoxElement = document.getElementById("ccode");
            var selectedValue = selectElement.value;
            var existingStyles = textBoxElement.value;

            var newStyle = 'p{font-family:"' + selectedValue + '";}';
            
            if (!existingStyles.includes(newStyle)) {
                textBoxElement.value += newStyle;
            }

            element.style.fontFamily = selectElement.value;
            }

             element.style.fontFamily = selectElement;
            
            //センテンスカラー（仮）
            function getColorCode() {
            var colorSelect = document.getElementById("colorSelect");
            var colorCodeElement = document.getElementById("ccode");
            var selectedColorCode = colorSelect.value;

            var currentStyles = colorCodeElement.value;
           
            var newStyles = "p { color: " + selectedColorCode + "; }";
            
            // 「p{color: }」の部分を削除
            var updatedStyles = currentStyles.replace(/p\s*\{\s*color:\s*[^;]*;\s*\}/g, "");
            
            // テキストの末尾に新しいスタイル定義を追加
            if (selectedColorCode !== "") {
                updatedStyles += newStyles;
            }

            colorCodeElement.value = updatedStyles;
                    }


            //揃え
            function getButtonText(buttonValue) {
            var aliElement = document.getElementById("ccode");
            var buttonText = buttonValue;

            var updatedStyl = aliElement.value;

            // 特定のスタイルを削除するための正規表現パターン
            var pattern = /\.preview\s*\{[^\}]*text-align:\s*[^;]*;\s*\}/g;
            
            // テキストボックス内の特定のスタイルを削除
            updatedStyl = updatedStyl.replace(pattern, "");

            var newStyl1 = ".preview{ text-align: " + buttonText + "; }";
            updatedStyl += newStyl1;
            aliElement.value = updatedStyl;
            }



            //ここから下、ＨＴＭＬとＣＳＳのテキストボックス内容をPreviewできるようにする為のコード
        
        //     var obj = document.activeElement;
       

        //     code.addEventListener("input",preview);
        //     ccode.addEventListener("input",preview);


        // function preview() {
        // // HTMLコードとCSSコードを取得
        // var htmlCode = document.getElementById("code").value;
        // var cssCode = document.getElementById("ccode").value;
        // // <div id="view"></div> 内にHTMLコードを挿入
        // document.getElementById("view").innerHTML = htmlCode;
        // // CSSルールを定義
        // var style = document.createElement("style");
        // style.innerHTML = cssCode;
        // // <div id="view"></div> 内にCSSルールを挿入
        // document.getElementById("view").appendChild(style);

        // }
        // //セレクトのフォーカスを外す為のコード
        // const selectElement = document.querySelector('select');

        // selectElement.addEventListener('change', () => {
        // selectElement.blur();
        // });

        //ここまで