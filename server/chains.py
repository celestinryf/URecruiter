from model import agent
from langchain.prompts import PromptTemplate
import datetime


def send_available_email(candidate, interviewer, job_description):

    input_data = {
        "message": {
            "to": candidate + ", " + interviewer,
            "subject": "Interview Availability",
            "body": """Please respond with times you are available for the next upcoming week.
                        Format your response as: Date:  Times Available: """
        }
    }

    prompt = PromptTemplate.from_template("""
        Draft and send this email with the following attributes: {attributes}
        for the following job description: {job_description}. Generate a unique id for the email
        and add it to the Subject. Create times for the next 14 days between Monday and Friday and times from 9AM to 5PM.
        The date today is {date}
        The generated times should be displayed as a numbered list.                                                                    
        """)
    

    chain = prompt | agent

    return chain.invoke({"attributes": input_data, "job_description": job_description, "date": datetime.datetime.now()})

def get_available_times(candidate, interviewer, job_description):

    get_prompt = PromptTemplate.from_template("""
        Get and return the body of all email replies that subject's are Interview Availability.
        From the email: {email_1} and email: {email_2}. Return only the bodies of the email reply.
        Parse the email replies to check for matching times written in the body. If there are matching times
        pick a single time and output only the matched time. If there is not a matched time peform this function: {function}
        and break out of the current function.
        """)
    
    get_email_chain = get_prompt | agent


    time = get_email_chain.invoke({"email_1": candidate, "email_2": interviewer, "function": send_available_email(candidate, interviewer, job_description)})['output']


    input_data = {
        "message": {
            "to": candidate + ", " + interviewer,
            "subject": "Interview: ",
            "body": """"""
        }
    }

    send_prompt = PromptTemplate.from_template("""
        Draft and send an email with the following attributes: {attributes}.
        Add to the subject this date: {date}.
        Generate and add a body to the email giving tips for the interview and stating the date of the interview.
        Use this job description: {job_description} and this date: {date} to generate the body. 
        """)


    send_email_chain = send_prompt | agent

    res = send_email_chain.invoke({"attributes": input_data, "date": time, "job_description": job_description})

    return agent.invoke("Send this email: " + res['output'])
