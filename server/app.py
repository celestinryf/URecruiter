from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from generate_description import app as generate_description_app
# from jobpost import postJob

load_dotenv()

app = Flask(__name__)

# Correct CORS configuration
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True  # Note the correct key name
    }
})

# Register the routes
app.register_blueprint(generate_description_app)

# @app.route("/api/generate-post", methods=["POST"])
# def generatePost():
#     return postJob()

if __name__ == "__main__":
    app.run(debug=True)