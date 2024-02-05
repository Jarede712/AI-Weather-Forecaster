const { OpenAI } = require('@langchain/openai');
require('dotenv').config();

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: 'gpt-3.5-turbo',
});

const promptFunc = async () => {
  try {
    const res = await model.call(
      'Give me the 7 day weather forecast for San Diego'
    );
    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

promptFunc();
