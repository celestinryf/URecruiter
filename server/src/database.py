import os
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, sessionmaker, declarative_base
from sqlalchemy.sql import func
from dotenv import load_dotenv
import enum

load_dotenv()

Base = declarative_base()

class UserRole(enum.Enum):
    RECRUITER = "recruiter"
    CANDIDATE = "candidate"

class ApplicationStatus(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    
    applications = relationship("JobApplication", back_populates="user")

class JobPosting(Base):
    __tablename__ = 'job_postings'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    
    applications = relationship("JobApplication", back_populates="job_posting")

class JobApplication(Base):
    __tablename__ = 'job_applications'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    job_posting_id = Column(Integer, ForeignKey('job_postings.id'), nullable=False)
    resume_path = Column(String, nullable=True)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING)
    
    user = relationship("User", back_populates="applications")
    job_posting = relationship("JobPosting", back_populates="applications")

DB_USERNAME = os.getenv('DB_USERNAME', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'recruitment_db')

DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(bind=engine)

def drop_tables():
    try:
        Base.metadata.drop_all(bind=engine)
        print("All tables dropped successfully!")
    except Exception as e:
        print(f"Error dropping tables: {e}")

def create_tables():
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating tables: {e}")

def seed_sample_data():
    session = SessionLocal()
    
    try:
        recruiter = User(
            username="recruiter1",
            name="Jane Smith", 
            email="jane@company.com",
            role=UserRole.RECRUITER
        )
        session.add(recruiter)
        
        user = User(
            username="johndoe",
            name="John Doe", 
            email="john@example.com",
            role=UserRole.CANDIDATE
        )
        session.add(user)
        
        job_posting = JobPosting(
            title="Software Engineer",
            company="Tech Startup",
            description="Exciting opportunity for a passionate developer!"
        )
        session.add(job_posting)
        
        job_application = JobApplication(
            user=user,
            job_posting=job_posting,
            resume_path="/path/to/resume.pdf",
            status=ApplicationStatus.PENDING
        )
        session.add(job_application)
        
        session.commit()
        print("Sample data added successfully!")
    except Exception as e:
        session.rollback()
        print(f"Error adding sample data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    drop_tables()
    create_tables()
    seed_sample_data()