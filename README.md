# POEMDLE
In a world where words weave magic and poetry paints pictures, welcome to Poemdle - where the art of guessing meets the beauty of verse. Instead of guessing just one word, you unravel the mysteries of entire poems. Welcome to a new dimension of wordplay, where every guess is a step closer to unlocking the poet's heart.

## Video
Try it live at [Poemdle](https://poemdle.netlify.app/)

https://github.com/AJ1904/poemdle-app/assets/49027490/bd43ef0b-9fda-4b13-b953-c4ee13e8fc73

Watch on [YouTube](https://www.youtube.com/watch?v=mVsnmNy7WAc)

## Technology Stack
- MindsDB
- Flagsmith
- React
- Javacript
- Python
- CSS

## What will you need to run the app locally
- MindsDB setup locally or access to cloud MindsDB.
- Flagsmith account.
- OpenAI API key.

## Steps to reproduce
1. Clone the Repository:
  `git clone https://github.com/aj1904/poemdle-app.git`

2. Navigate to the Project Directory:
  `cd poemdle-app`

3. Install Dependencies:
  `npm install`

4. Setup [MindsDB](https://mindsdb.com/) account, database and model
  - Run the SQL queries present in MindsDBSQLSetup.sql. 
  - Use your [OpenAI API key](https://openai.com/blog/openai-api).

5. Setup [Flagsmith](https://www.flagsmith.com/) account
  - Use your Flagsmith environment id in index.js file.
  - Define these flags in your Flagsmith account:
    - footer: this determines whether to show footer or not.
    - help_popup: this determines whether to show help instructions or not (Work in progress).
    - hints: this determines whether to enable hints or not.
    - score_tracking: this determines whether to track scores or not.

6. Setup Backend (Optional)
  - Not required necessarily, the app works without it.
  - But if you want to try your hands on new poems everyday, you can use this python script to connect to your MindsDB database and generate a new poem which will get updated in `poemtoday.js` file.
  - Pass a topic name to generate a poem of your wish. `python backend.py 'love'`
  - You also have an option to save generated poems in MongoDB database for future reference.

7. Run the Application:
`npm start`
  - Navigate to https://localhost:3000 and have fun!
  - Or try it live at [Poemdle](https://poemdle.netlify.app/)
