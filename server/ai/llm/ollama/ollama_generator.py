import requests
import json

# Function to generate text using Ollama LLM
#
# Parameters:
# input_text (str): The input prompt text
# model (str): The model name to use (default: "mistral")
#
# Returns:
# str: The generated text response
def ollama_generate_text(input_text: str, model: str = "llama3.2") -> str:

    
    # Ollama API endpoint
    url = "http://192.168.18.9:11434/api/generate"
    
    # Request payload
    payload = {
        "model": model,
        "prompt": input_text,
        "stream": False
    }
    
    try:
        # Make POST request to Ollama
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise exception for bad status codes
        
        # Parse response
        result = response.json()
        return result.get('response', '')
        
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Ollama: {str(e)}")
        return f"Error: {str(e)}"
    except json.JSONDecodeError as e:
        print(f"Error parsing response: {str(e)}")
        return f"Error: Invalid response format"


