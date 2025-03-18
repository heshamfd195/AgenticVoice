import json
from typing import Any, Union
from pydantic import BaseModel, ValidationError

def load_json_to_dict(file_path: str) -> dict:
    """
    Reads a JSON file and returns its contents as a dictionary.
    
    Args:
        file_path (str): Path to the JSON file
        
    Returns:
        dict: Dictionary containing the JSON data
        
    Raises:
        FileNotFoundError: If the specified file doesn't exist
        json.JSONDecodeError: If the file contains invalid JSON
    """
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        raise FileNotFoundError(f"The file {file_path} was not found")
    except json.JSONDecodeError:
        raise json.JSONDecodeError(f"Error decoding JSON from {file_path}")

def json_to_dict_helper(json_data: Union[str, dict]) -> dict:
    """
    Converts JSON data to a dictionary using Pydantic validation.
    
    Args:
        json_data (Union[str, dict]): JSON data to convert (string or dict)
        
    Returns:
        dict: Validated dictionary containing the JSON data
        
    Raises:
        ValidationError: If the JSON data is invalid
        json.JSONDecodeError: If the JSON string is malformed
    """
    try:
        # If input is string, parse it first
        if isinstance(json_data, str):
            json_data = json.loads(json_data)
            
        # Create a dynamic Pydantic model based on the JSON structure
        class DynamicModel(BaseModel):
            class Config:
                extra = "allow"
                
        # Validate and convert to dict
        validated_data = DynamicModel.parse_obj(json_data)
        return validated_data.dict()
        
    except json.JSONDecodeError:
        raise json.JSONDecodeError(f"Invalid JSON string provided")
    except ValidationError as e:
        raise ValidationError(f"Invalid data structure: {str(e)}")
