-- Create database
CREATE database poemdle_database;

-- Use database
USE poemdle_database;

-- Create OpenAI ML Engine, use your key
CREATE ML_ENGINE openai_engine_poemdle
FROM openai
USING
    openai_api_key = '<YOUR_OPENAI_KEY>';

-- Create machine learning model
CREATE MODEL poem_generating_model 
PREDICT poem
USING
    engine = 'openai_engine_poemdle',
    prompt_template = 'generate poem on {{topic}}';

-- Test query to check if model works
SELECT * FROM poem_generating_model WHERE topic ='love' limit 1;
