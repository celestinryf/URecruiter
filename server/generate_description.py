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
            print("Error initializing JobDescriptionGenerator:", str(e))
            self.chain = None  # Prevent further issues if initialization fails

    def generate(self, title, company, keywords, experience):
        if not self.chain:
            raise RuntimeError("JobDescriptionGenerator is not initialized properly.")
        return self.chain.run(
            title=title,
            company=company,
            keywords=keywords,
            experience=experience
        )

