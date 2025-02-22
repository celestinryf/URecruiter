from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Explicit CORS configuration: Allow all origins or only specific ones
CORS(app, origins="http://localhost:5173", methods=["GET", "POST"])

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.get_json()
    print(data)
    return jsonify(message="Data received", data=data), 200

if __name__ == "__main__":
    app.run(debug=True)
