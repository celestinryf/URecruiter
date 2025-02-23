from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv


load_dotenv()


app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

if __name__ == "__main__":
    app.run(debug=True)