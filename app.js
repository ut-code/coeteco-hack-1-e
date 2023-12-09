const API_KEY = '';
const URL = "https://api.openai.com/v1/chat/completions";

function reply() {
    var text = document.getElementById("request_text").value;
    async function getResponse() {
        try {
            const response = await axios.post(
                URL,
                {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        { "role": "user", "content": text }
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
            $("#response_text").val(chatgpt_response);
        } catch (error) {
            console.log(error);
        }
    }
    getResponse();
}

function getKeywords(theme) {
    var text = document.getElementById("request_text").value;
    async function getResponse() {
        try {
            const response = await axios.post(
                URL,
                {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        { "role": "user", "content": `「${theme}」に関連する名詞を4つあげてください。4つの名詞はカンマで区切ってください。小学校低学年にわかりやすい言葉をあげてください。「食べ物, 筋肉, 骨, 健康」のように答えてください。` }
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
            $("#response_text").val(chatgpt_response);
            displayKeywordButtons(chatgpt_response.split(','));
        } catch (error) {
            console.log(error);
        }
    }
    getResponse();
}

function displayKeywordButtons(keywords) {
    const keywordButtonsDiv = document.getElementById('keywordButtons');
    keywordButtonsDiv.innerHTML = '';

    // 取得したキーワードをボタンとして表示
    keywords.forEach(keyword => {
        const button = document.createElement('button');
        button.innerText = keyword.trim();
        button.onclick = function() {
            // ボタンがクリックされたら、そのキーワードに関する質問をChatGPTに送信
            getKeywords(keyword);
        };
        keywordButtonsDiv.appendChild(button);
    });
}