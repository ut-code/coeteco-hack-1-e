
const API_KEY = "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";

function askQuestion(theme) {
    
    const questionsAndAnswers = document.getElementById('questionsAndAnswers');
    //もう一回聞いたときのために、元々の「キーワード」のボタン、「○○についてしつもん！」ボタンを消す
    document.getElementById("keywordButtons").innerHTML = "";
    document.getElementById("questionButton").innerHTML = "";
    questionsAndAnswers.innerHTML = `<div>${theme}について、AIに聞いています。ちょっとまってね！</div>`;
    
    async function makeQuestion() {
        try {
            const response = await fetch('/chat', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: `${theme}に関する質問を4つ作り、それに回答してください。以下の条件を守って下さい。\n条件1:小学生に話しかける、なるべく漢字を使わない簡単な言葉で質問と回答を作って下さい。\n条件2:質問や回答が漢字を含む場合は必ず、全ての漢字に送り仮名をつけてください。` }),
            })
            .then(response => response.json())
            .then(data => {
                // ChatGPTからの応答を表示
                var chatgpt_response = data.response;
                questionsAndAnswers.innerHTML = "";
                const question = document.createElement('p');
                question.innerText = chatgpt_response;
                questionsAndAnswers.appendChild(question);
                //終わる(はじめの画面に戻る)ボタンをつくる
                const resetButton = document.createElement("button");
                resetButton.innerText = "おわる"
                resetButton.onclick = () => {
                    location.reload();
                } 
                questionsAndAnswers.appendChild(resetButton);
                //違う質問をするボタンをつくる
                const askAnotherQuestionButton = document.createElement("button");
                askAnotherQuestionButton.innerText = `${theme}についてもっときく！`
                askAnotherQuestionButton.onclick = () => {
                    askQuestion(theme);
                }
                questionsAndAnswers.appendChild(askAnotherQuestionButton)
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function answerQuestion(question) {
        try {
            console.log(question)
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: `${question} 小学校低学年にわかるように3行程度で説明してください。` }),
            })
            .then(response => response.json())
            .then(data => {
                // ChatGPTからの応答を表示
                var chatOutput = document.getElementById('chatOutput');
                chatOutput.innerHTML = '<p>User: ' + userInput + '</p><p>ChatGPT: ' + data.response + '</p>';
            })
            .catch(error => {
                console.error('Error:', error);
            });
            var chatgpt_response = response.data.choices[0].message.content;
            const questiondiv = document.createElement('p');
            const answer = document.createElement('p');
            questiondiv.innerText = question;
            console.log(answer)
            answer.innerText = chatgpt_response;
            questionsAndAnswers.appendChild(questiondiv);
            questionsAndAnswers.appendChild(answer);
        } catch (error) {
            console.log(error);
        }
    }
    makeQuestion();
}

function getKeywords(theme) {
    //二度押し防止でボタンを消す
    document.getElementById("keywordButtons").innerHTML = `${theme}のなにをしりたい？`
    document.getElementById("questionButton").innerHTML = "";
    // var text = document.getElementById("request_text").value;
    async function getResponse() {
        try {
            console.log(theme);
            const response = await fetch('/chat', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: `「${theme}」に関連する名詞を4つあげてください。4つの名詞は半角カンマ(,)で区切ってください。小学校低学年にわかりやすい言葉をあげてください。「食べ物, 筋肉, 骨, 健康」のように答えてください。` }),
            })
            .then(response => response.json())
            .then(data => {
                // ChatGPTからの応答を表示
                console.log(data.response);
                var chatgpt_response = data.response;
                if (/^[^\uFF0C\uff10-\uff19\uff0e0-9.\u3000-\u3002]*$/.test(chatgpt_response)) {
                    displayKeywordButtons(theme, chatgpt_response.split(','));
                } else {
                    document.getElementById("keywordButtons").innerHTML = `すみません。エラーになりました。${theme}についてもう1かいきいてみよう！<br/><button onclick="getKeywords('${theme}')">${theme}について知りたい</button>`
                    console.log(chatgpt_response);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } catch (error) {
            console.log(error);
        }
    }
    getResponse();
}

function displayKeywordButtons(theme, keywords) {
    const keywordButtonsDiv = document.getElementById('keywordButtons');
    keywordButtonsDiv.innerHTML = '';

    // 取得したキーワードをボタンとして表示
    keywords.forEach(keyword => {
        const button = document.createElement('button');
        button.innerText = keyword.trim();
        button.onclick = function() {
            // ボタンがクリックされたら、そのキーワードに関する質問をChatGPTに送信
            button.disabled = true;
            button.style.color = "red";
            getKeywords(keyword);
            // 関数実行中はクリックできないようにする
            button.disabled = false;
        };
        keywordButtonsDiv.appendChild(button);
    });

    // "についてしつもん" ボタンを表示
    const questionButtonDiv = document.getElementById('questionButton');

    // すでにボタンが存在する場合は上書き
    const existingButton = questionButtonDiv.querySelector('button');
    if (existingButton) {
        existingButton.innerText = `${theme}についてしつもん`;
        existingButton.onclick = function() {
            // ボタンがクリックされたら、そのキーワードに関する質問をChatGPTに送信
            existingButton.disabled = true;
            existingButton.style.color = "red";
            askQuestion(theme);
            existingButton.disabled = false;
        };
    } else {
        // 存在しない場合は新たに作成
        const button = document.createElement('button');
        button.innerText = `${theme}についてしつもん`;
        button.onclick = function() {
            // ボタンがクリックされたら、そのキーワードに関する質問をChatGPTに送信
            button.disabled = true;
            button.style.color = "red";
            askQuestion(theme);
            button.disabled = false;
        };
        questionButtonDiv.appendChild(button);
    }
}