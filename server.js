require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");

/*const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);*/

const API_KEY = process.env.API_KEY;

// const URL = "https://api.openai.com/v1/chat/completions";

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const openai = require('openai');

const app = express();
const port = 3000;

// あなたのChatGPT APIキーを設定
const chatgptEndpoint = 'https://api.openai.com/v1/chat/completions';

app.use(bodyParser.json());
app.use(express.static('static'));

app.post('/chat', async (req, res) => {
  const userInput = req.body.userInput;

  // ChatGPTにリクエストを送信
  try {
      const response = await fetch(chatgptEndpoint, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
              model: "gpt-3.5-turbo-1106",
              messages: [
                { "role": "user", "userInput": userInput }
              ],
              max_tokens: 150,
          }),
      });

      const responseData = await response.json();

      if (!response.ok) {
          console.error('Error response from OpenAI API:', responseData);
          res.status(500).json({ error: 'Internal Server Error', details: responseData });
          return;
      }

      console.log('OpenAI API response:', responseData);

      // 応答をクライアントに送信
      res.json({ response: responseData.choices[0].message.content });
      console.log('Message Content:', messageContent);
  } catch (error) {
      console.error('Error making request to OpenAI API:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});