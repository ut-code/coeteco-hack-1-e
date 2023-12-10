// require('dotenv').config();
// const API_KEY = process.env.API_KEY;
const API_KEY = "";

const URL = "https://api.openai.com/v1/chat/completions";

function askQuestion(theme) {
    // var text = document.getElementById("request_text").value;
    
    const questionsAndAnswers = document.getElementById('questionsAndAnswers');
    //もう一回聞いたときのために、元々の「キーワード」のボタン、「○○についてしつもん！」ボタンを消す
    document.getElementById("keywordButtons").innerHTML = "";
    document.getElementById("questionButton").innerHTML = "";
    //待ち時間に豆知識
    const tips = ["ハチミツはくさらない","人間の体にある血管を全てつなげると、地球2周以上になる！","お菓子のガムとチョコレートを一緒に食べると、チョコレートもガムもとける！","ショートケーキの「short（ショート）」には「サクサクした」という意味があります。","イカには、しんぞうが3つある！"]
    const text = tips[Math.floor(Math.random() * tips.length)]
    questionsAndAnswers.innerHTML = `
        <div class="waiting">
            <div>${theme}について、AIに聞いています。ちょっとまってね！</div>
            
            <div class="tips">まめちしき</div>
            <div class="tips">${text}</div>
            
            <div class="loader"></div>
        </div>`;
    async function makeQuestion() {
        try {
            const response = await axios.post(
                URL,
                {
                    "model": "gpt-4-1106-preview",
                    "messages": [
                        { "role": "user", "content": `${theme}に関する質問を4つ作り、それに回答してください。以下の条件を守って下さい。\n条件1:小学生に話しかける、なるべく漢字を使わない簡単な言葉で質問と回答を作って下さい。\n条件2:質問や回答が漢字を含む場合は必ず、全ての漢字に送り仮名をつけてください。` }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${API_KEY}`,
                    },
                }
            );
            var chatgpt_response = response.data.choices[0].message.content;
            questionsAndAnswers.innerHTML = "";
            const question = document.createElement('p');
            question.innerText = chatgpt_response;
            questionsAndAnswers.appendChild(question);
            //終わる(はじめの画面に戻る)ボタンをつくる
            const resetArea = document.getElementById("reset");
            const resetButton = document.createElement("button");
            resetButton.innerText = "おわる"
            resetButton.onclick = () => {
                location.reload();
            } 
            resetArea.appendChild(resetButton);
            //違う質問をするボタンをつくる
            const askAnotherQuestionButton = document.createElement("button");
            askAnotherQuestionButton.innerText = `${theme}についてもっときく！`
            askAnotherQuestionButton.onclick = () => {
                askQuestion(theme);
            }
            resetArea.appendChild(askAnotherQuestionButton)

            // answerQuestion(chatgpt_response);
        } catch (error) {
            console.log(error);
        }
    }
    /*
    async function answerQuestion(chatgpt_response) {
        try {
            const response = await axios.post(
                URL,
                {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        { "role": "user", "content": `${chatgpt_response} 小学校低学年にわかるように説明してください。` }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${API_KEY}`,
                    },
                }
            );
            var chatgpt_response = response.data.choices[0].message.content;
            const answer = document.createElement('p');
            answer.innerText = chatgpt_response;
            questionsAndAnswers.appendChild(answer);
        } catch (error) {
            console.log(error);
        }
    }*/
    makeQuestion();
}

function getKeywords(theme) {
    //二度押し防止でボタンを消す
    document.getElementById("keywordButtons").innerHTML = `${theme}のなにをしりたい？`
    document.getElementById("questionButton").innerHTML = "";
    // var text = document.getElementById("request_text").value;
    async function getResponse() {
        try {
            const response = await axios.post(
                URL,
                {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        { "role": "user", "content": `「${theme}」に関連する名詞を4つあげてください。4つの名詞はカンマ(,)で区切ってください。小学校低学年にわかりやすい言葉をあげてください。「食べ物, 筋肉, 骨, 健康」のように答えてください。` }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${API_KEY}`,
                    },
                }
            );
            var chatgpt_response = response.data.choices[0].message.content;
            // $("#response_text").val(chatgpt_response);
            //「キーワード1,キーワード2,....」の形でないときは弾く
            if (/^[^\uFF0C\uff10-\uff19\uff0e0-9.\u3000-\u3002]*$/.test(chatgpt_response)) {
                displayKeywordButtons(theme, chatgpt_response.split(','));
            } else {
                document.getElementById("keywordButtons").innerHTML = `すみません。エラーになりました。${theme}についてもう1かいきいてみよう！<br/><button onclick="getKeywords('${theme}')">${theme}について知りたい</button>`
            }
            
        } catch (error) {
            console.log(error);
        }
    }
    getResponse();
}

function displayKeywordButtons(theme, keywords) {
    const keywordButtonsDiv = document.getElementById('keywordButtons');
    keywordButtonsDiv.classList = ["center"];
    keywordButtonsDiv.innerHTML = '';

    // 取得したキーワードをボタンとして表示
    let i = 1;
    keywords.forEach(keyword => {
        const button = document.createElement('button');
        button.classList = ["button"];
        button.id = ["keyword" + i.toString()];
        i++;
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
        const br = document.createElement("br");
        
    });

    //グリッド
    document.getElementById("wrapper").classList = ["wrapper"]

    // "についてしつもん" ボタンを表示
    const questionButtonDiv = document.getElementById('questionButton');

    // すでにボタンが存在する場合は上書き
    const existingButton = questionButtonDiv.querySelector('button');
    if (existingButton) {
        existingButton.innerText = `${theme}についてしつもん!!`;
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
        button.innerText = `${theme}についてしつもん!!`;
        button.id = "askButton";
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