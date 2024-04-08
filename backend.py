# Import necessary libraries
from pymongo import MongoClient  # MongoDB client
import mindsdb_sdk  # MindsDB SDK
import sys  # System-specific parameters and functions

# Set default topic
topic = 'you are unique'

# Change topic if provided as command line argument
if len(sys.argv) > 1:
    topic = sys.argv[1]

# Only required when you want to store the generated poems in MongoDB
# MongoDB connection
mongo_client = MongoClient('<YOUR_MONGODB_CONNECTION_STRING>')
db = mongo_client['poemdle']  # Selecting the database
collection = db['poems']  # Selecting the collection

# MindsDB connection
server = mindsdb_sdk.connect('http://127.0.0.1:47334')
database = server.get_database('mongo_datasink')  # Database where the model is stored
project = server.get_project('poemdle_database')  # Project containing the model
model = project.get_model('poem_generating_model')  # Model for generating poems

# Predict poem based on the provided topic
prediction_result = model.predict({'topic': topic})
poem = prediction_result.iloc[0]['poem']

# Filter out empty lines and lines with only whitespace characters
poem_lines = [line.strip() for line in poem.split('\n') if line.strip()]

# Create document to be inserted into MongoDB collection
document = {
    'topic': topic,
    'poem': '\n'.join(poem_lines)
}

# Insert document into MongoDB collection
collection.insert_one(document)

# Save the document in a JavaScript file for use in front-end
with open('src/data/poemtoday.js', 'w') as file:
    file.write(f"const poemsdictionary = {{'{topic}': `{document['poem']}`}};\nexport default poemsdictionary; ")
