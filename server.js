// require('dotenv').config();
require('dotenv').config();
const API_KEY = process.env.API_KEY;
// const API_KEY = "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";

const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static("static"))
const port = process.env.PORT || 3000;

/*
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
*/

app.post('/chat', async (req, res) => {
  console.log(req.body);
  const userInput = req.body.content;
  console.log(userInput);

  // ChatGPTにリクエストを送信
  const response = await fetch(URL, {
    method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    messages: [{"role": "system", "content": "これは何ですか？"},
                    {"role": "system", "content": "日本語で答えてください"},
                    {"role": "user", "content": userInput}],
                    model: "gpt-3.5-turbo",
                    max_tokens: 500,
                    temperature: 1,
                    n: 1,
                    stop: '###'
                })
            })
            .then(response => response.json())
            .then(data => {
                const text = data.choices[0].message.content;
                // output.textContent = text;
                console.log(text);
                res.json({ response: text.trim() });
            })
            .catch(error => console.error(error));
    /*method: 'post',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
          { "role": "user", "content": userInput }
      ]
  }),
  })
  // .then(response => response.json())
  .then(data => {
    // ChatGPTからの応答を表示
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  /*const response = await fetch(URL, {
      method: 'post',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
          prompt: userInput
      }),
  });*/
  // console.log(response.json());

  // const responseData = await response.json();
  

  // 応答をクライアントに送信
  
});


const URL = "https://api.openai.com/v1/chat/completions";

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});