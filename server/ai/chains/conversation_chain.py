from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_ollama.llms import OllamaLLM

# Initialize the Ollama model
llm = OllamaLLM(model="llama3.2", base_url="http://192.168.18.9:11434")

# Define the prompt template for general conversation
template = """
You are a helpful AI assistant that can engage in natural conversations on various topics.
Please provide clear, concise, and helpful responses.
Keep your responses friendly and informative.
Important: Limit all responses to a maximum of 100 words.

Current conversation:
Human: {question}
Assistant:
"""
prompt = PromptTemplate(input_variables=["question"], template=template)

# Create the chain
math_chain = LLMChain(llm=llm, prompt=prompt)

def conversation_chain(question):
    """
    Function to take text or question as input and return the response text.
    """
    response = math_chain.invoke({"question": question})
    return response['text']


