document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトのフォーム送信を防止

    const searchValue = document.getElementById('searchInput').value;

    // フォームの値をNode.jsのAPIエンドポイントに送信
    fetch('/siteURL?value=' + encodeURIComponent(searchValue))
      .then(response => response.json())
      .then(data => {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = ''; // 検索結果をクリア

        // 取得した結果を表示
        data.forEach(result => {
          const resultElement = document.createElement('p');
          resultElement.textContent = result;
          searchResults.appendChild(resultElement);
        });
      })
      .catch(error => {
        console.error('エラーが発生しました', error);
      });
  });





