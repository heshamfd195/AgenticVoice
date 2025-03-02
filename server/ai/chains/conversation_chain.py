from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_ollama.llms import OllamaLLM

# Initialize the Ollama model
llm = OllamaLLM(model="llama3.2", base_url="http://192.168.18.9:11434")

# Define the prompt template to restrict questions to addition and subtraction with max 200 words
template = """
You are a helpful AI that only answers math questions related to addition and subtraction.
If the question is not about addition or subtraction, reply with: "I can only answer addition or subtraction questions."
Limit your response to a maximum of 200 words.
Question: {question}
Answer:
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

# Example usage
# if __name__ == "__main__":
#     question = "What is 15 + 7?"
#     result = conversation_chain(question)
#     print(f"Question: {question}")
#     print(f"Response: {result}")
#     print("-")
