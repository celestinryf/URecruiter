import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database configuration using environment variables
DB_USERNAME = os.getenv('DB_USERNAME', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'recruitment_db')

# Construct the DATABASE_URL
DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create SQLAlchemy engine with additional configuration
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    pool_pre_ping=True,  # Test connections before using them
    pool_recycle=3600,   # Recycle connections after 1 hour
)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()

def test_database_connection():
    """
    Test the database connection.
    
    Returns:
    - True if connection is successful
    - False if connection fails
    - Prints additional error information if connection fails
    """
    try:
        # Create a connection
        with engine.connect() as connection:
            # Execute a simple query to test the connection
            result = connection.execute(text("SELECT 1"))
            
            # Fetch the result to ensure it works
            scalar_result = result.scalar()
            
            # If we get here, connection is successful
            print("🟢 Database connection successful!")
            print(f"Test query result: {scalar_result}")
            return True
    
    except SQLAlchemyError as e:
        # Handle specific SQLAlchemy errors
        print("🔴 Failed to connect to the database.")
        print(f"Error details: {e}")
        print("\nTroubleshooting tips:")
        print("1. Check if PostgreSQL is running")
        print("2. Verify DATABASE_URL credentials")
        print("3. Ensure the database exists")
        return False

def get_db():
    """
    Dependency that creates a new database session for each request 
    and closes it after the request is completed.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Optional: Automatically test connection when this module is run
if __name__ == "__main__":
    test_database_connection()