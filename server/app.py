from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
from jobpost import postJob
from applicant_recruiting import JobDescriptionGenerator

load_dotenv()


app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

@app.post("/generate-description", methods=["POST"])
def generateDesc():
    JobDescriptionGenerator.generate(title=, company=, keywords=, experience=)

@app.post("/generate-post", methods=["POST"])
def generatePost():
    postJob()

if __name__ == "__main__":
    app.run(debug=True)