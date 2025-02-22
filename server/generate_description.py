from flask import Blueprint, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from langchain_community.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Create Blueprint
generate_description_app = Blueprint('generate_description', __name__)

# Apply CORS to this specific blueprint
CORS(generate_description_app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Check if API key is available
if not OPENAI_API_KEY:
    print("⚠️ ERROR: OPENAI_API_KEY is missing. Please check your .env file.")

class JobDescriptionGenerator:
    def __init__(self):
        try:
            if not OPENAI_API_KEY:
                raise ValueError("OPENAI_API_KEY is missing. Ensure it's set in the .env file.")

            self.llm = OpenAI(temperature=0.7, openai_api_key=OPENAI_API_KEY)  # Ensure API key is passed
            self.template = PromptTemplate(
                input_variables=["title", "company", "keywords", "experience"],
                template="""Create a professional job description for the following:
                
                Job Title: {title}
                Company: {company}
                Keywords: {keywords}
                Experience Level: {experience}
                
                Include sections for: Company Overview, Job Description, Requirements, Benefits.
                Keep it professional and engaging. Format with appropriate Markdown.
                """
            )
            self.chain = LLMChain(llm=self.llm, prompt=self.template)

        except Exception as e:
            print("❌ Error initializing JobDescriptionGenerator:", str(e))
            self.chain = None  # Prevent further issues if initialization fails

    def generate(self, title, company, keywords, experience):
        if not self.chain:
            raise RuntimeError("❌ JobDescriptionGenerator is not initialized properly.")
        return self.chain.run(
            title=title,
            company=company,
            keywords=keywords,
            experience=experience
        )

@generate_description_app.route('/generate-description', methods=['POST'])
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

        # Generate job description
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
        print("❌ Runtime Error:", str(re))
        return jsonify({'error': 'Internal Server Error', 'details': str(re)}), 500
    except Exception as e:
        print("🔥 SERVER ERROR:", str(e))  # Print error for debugging
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# Manually handle OPTIONS requests to prevent CORS preflight issues
@generate_description_app.route('/generate-description', methods=['OPTIONS'])
def handle_options():
    response = jsonify({'message': 'OK'})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response
