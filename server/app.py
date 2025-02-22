from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from generate_description import JobDescriptionGenerator
import os

load_dotenv()

app = Flask(__name__)

CORS(app, origins="http://localhost:5173", methods=["GET", "POST"])

@app.route('/api/generate', methods=['POST'])
def generate_description():
    try:
        # Get data from request
        data = request.json

        # Extract form fields
        title = data.get('jobTitle')
        company = data.get('companyName')
        keywords = data.get('keywords', [])
        experience = data.get('experience')

        # Validate required fields
        if not all([title, company, experience]):
            return jsonify({'error': 'Missing required fields'}), 400

        generator = JobDescriptionGenerator()
        if not generator.chain:
            return jsonify({'error': 'Failed to initialize JobDescriptionGenerator'}), 500

        description = generator.generate(
            title=title,
            company=company,
            keywords=", ".join(keywords),
            experience=experience
        )

        return jsonify({'description': description})

    except RuntimeError as re:
        print("Runtime Error:", str(re))
        return jsonify({'error': 'Internal Server Error', 'details': str(re)}), 500
    except Exception as e:
        print("SERVER ERROR:", str(e))  # Print error for debugging
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
