function getKeywords(theme) {
    // ChatGPTにテーマに基づく質問を送信
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-1106",
            messages: [
                { "role": "user", "content": `Provide keywords related to ${theme}.`  }
            ],
            max_tokens: 150
        }),
    })
    .then(response => response.json())
    .then(data => {
        // ChatGPTからの応答を表示
        var chatOutput = document.getElementById('chatOutput');
        chatOutput.innerHTML += '<p>User: Provide keywords related to ' + theme + '.</p><p>ChatGPT: ' + data.response + '</p>';

        // 取得したキーワードをボタンとして表示
        displayKeywordButtons(data.response.split(','));
        
        // リクエストが完了した後にuserInputをセット
        userInput = `Provide keywords related to ${theme}.`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayKeywordButtons(keywords) {
    var keywordButtonsDiv = document.getElementById('keywordButtons');
    keywordButtonsDiv.innerHTML = '';

    // 取得したキーワードをボタンとして表示
    keywords.forEach(keyword => {
        var button = document.createElement('button');
        button.innerText = keyword.trim();
        button.onclick = function() {
            // ボタンがクリックされたら、そのキーワードに関する質問をChatGPTに送信
            askQuestionAboutKeyword(keyword);
        };
        keywordButtonsDiv.appendChild(button);
    });
}

function askQuestionAboutKeyword(keyword) {
    var userInput = document.getElementById('userInput').value;

    // ChatGPTに質問を送信
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: `Tell me about ${keyword}.` }),
    })
    .then(response => response.json())
    .then(data => {
        // ChatGPTからの応答を表示
        var chatOutput = document.getElementById('chatOutput');
        chatOutput.innerHTML += '<p>User: Tell me about ' + keyword + '.</p><p>ChatGPT: ' + data.response + '</p>';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
