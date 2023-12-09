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
    questionsAndAnswers.innerHTML = `<div>${theme}について、AIに聞いています。ちょっとまってね！</div>`;
    async function makeQuestion() {
        try {
            const response = await axios.post(
                URL,
                {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        { "role": "user", "content": `「${theme}」に関する質問を4つ作り、それに回答してください。小学校低学年にわかるように説明してください。` }
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
            displayKeywordButtons(theme, chatgpt_response.split(','));
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