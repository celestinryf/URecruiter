from flask import Blueprint, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import anthropic
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

if not ANTHROPIC_API_KEY:
    logger.error("No Anthropic API key found in environment variables")
    raise ValueError("ANTHROPIC_API_KEY not found in .env file")

# Create blueprint
app = Blueprint('generate_description', __name__)

class JobDescriptionGenerator:
    def __init__(self):
        try:
            logger.debug("Initializing JobDescriptionGenerator")
            self.client = anthropic.Client(api_key=ANTHROPIC_API_KEY)
            self.template = """Create a professional job description for the following:
            
            Job Title: {title}
            Company: {company}
            Keywords: {keywords}
            Experience Level: {experience}
            
            Include sections for: Company Overview, Job Description, Requirements, Benefits.
            Keep it professional and engaging. Format with appropriate Markdown.
            """
            logger.debug("JobDescriptionGenerator initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing JobDescriptionGenerator: {str(e)}")
            logger.error(traceback.format_exc())
            raise
    
    def generate(self, title, company, keywords, experience):
        try:
            logger.debug(f"Generating description for job: {title} at {company}")
            logger.debug(f"Keywords: {keywords}")
            logger.debug(f"Experience: {experience}")
            
            prompt = self.template.format(
                title=title,
                company=company,
                keywords=keywords,
                experience=experience
            )
            
            message = self.client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=1500,
                temperature=0.7,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            logger.debug("Job description generated successfully")
            return message.content[0].text
        except Exception as e:
            logger.error(f"Error generating job description: {str(e)}")
            logger.error(traceback.format_exc())
            raise

@app.route('/api/generate-description', methods=['POST'])
def generate_description():
    try:
        logger.debug("Received generate-description request")
        logger.debug(f"Request data: {request.json}")

        data = request.json
        if not data:
            logger.error("No JSON data in request")
            return jsonify({'error': 'No data provided'}), 400

        title = data.get('jobTitle')
        company = data.get('companyName')
        keywords = data.get('keywords', [])
        experience = data.get('experience')

        logger.debug(f"Extracted fields - Title: {title}, Company: {company}, Keywords: {keywords}, Experience: {experience}")

        if not all([title, company, experience]):
            missing_fields = []
            if not title: missing_fields.append('jobTitle')
            if not company: missing_fields.append('companyName')
            if not experience: missing_fields.append('experience')
            
            error_msg = f"Missing required fields: {', '.join(missing_fields)}"
            logger.error(error_msg)
            return jsonify({'error': error_msg}), 400
            
        generator = JobDescriptionGenerator()
        description = generator.generate(
            title=title,
            company=company,
            keywords=", ".join(keywords),
            experience=experience
        )

        logger.debug("Successfully generated job description")
        return jsonify({'description': description})

    except Exception as e:
        error_msg = f"Error in generate_description: {str(e)}\n{traceback.format_exc()}"
        logger.error(error_msg)
        return jsonify({
            'error': 'Failed to generate description',
            'details': str(e),
            'trace': traceback.format_exc()
        }), 500

# Add error handler for the blueprint
@app.errorhandler(Exception)
def handle_error(e):
    logger.error(f"Unhandled exception: {str(e)}")
    logger.error(traceback.format_exc())
    return jsonify({
        'error': 'An unexpected error occurred',
        'details': str(e),
        'trace': traceback.format_exc()
    }), 500