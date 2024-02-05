// Dependencies
const { OpenAI } = require('@langchain/openai');
require('dotenv').config();
const inquirer = require('inquirer');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StructuredOutputParser } = require('langchain/output_parsers');

// Creates and stores a wrapper for the OpenAI package along with basic configuration
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: 'gpt-3.5-turbo',
});

// Creates a parser for the output of the model
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  Current_Temperature:
    'The current temperature of the location specified by the user',
  Forecast:
    'Seven day weather forecast, broken down day by day for the user in the form of a concise chart',
});

const formatInstructions = parser.getFormatInstructions(); // Get the format instructions for the parser

// Function to prompt the user for input and then call the model with the input
const promptFunc = async (input) => {
  try {
    const prompt = new PromptTemplate({
      template:
        'You are an expert weather forecaster, when the user gives you, or asks about, a location, you will provide them with a breakdown of the seven day weather forecast for that location, as well as the current temperature of the location specified.\n{format_instructions}\n{question}',
      inputVariables: ['question'],
      partialVariables: { format_instructions: formatInstructions },
    });
    const promptInput = await prompt.format({
      question: input,
    });
    const res = await model.call(promptInput);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

// Function to initialize the program
const init = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Ask for a location to get the 7 day weather report!',
      },
    ])
    .then((inquirerResponse) => {
      promptFunc(inquirerResponse.name);
    });
};

init();
