from selenium import webdriver
import time

def postJob():
    browser = webdriver.Firefox()
    # browser.get('https://github.com/ytang07/ai_agents_cookbooks/blob/main/llamaindex/openai_rag_agent_w_evals.ipynb')

    time.sleep(2);
    browser.close()

postJob()
