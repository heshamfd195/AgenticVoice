import json
from core.app import sio
from pydantic import BaseModel
from constants.socket_events import SocketEvents
from controller.voice_handler import  VoiceHandler
from utils.helpers import json_to_dict_helper, load_json_to_dict
import socketio


class VoiceController:
    _instance = None
    models_config:dict
    conversation_config:dict
    __handler:VoiceHandler
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VoiceController, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        
        """ Initialzed the Voice Handler """
        # set the conversation config
        self.conversation_config = load_json_to_dict("./configs/conversation/default.json")
        
        self.__handler=VoiceHandler()
        self.__handler.setup(self.conversation_config)
        self.register_events()
        
        return
    
    def set_conversation(self, conversation_config: json):
        """Setup the voice controller with conversation configuration.
        
        Args:
            conversation_config (json): Configuration for conversation settings
        """
        try:
            self.conversation_config = json_to_dict_helper(conversation_config)
            print(self.__conversation_config)
                
            self.register_events()
            
            return {"status": "success", "message": "Setup completed successfully"}
            
        except json.JSONDecodeError:
            return {"status": "error", "message": "Invalid JSON configuration"}
        except Exception as e:
            return {"status": "error", "message": f"Setup failed: {str(e)}"}
   
    def register_events(self):
        sio.on(SocketEvents.AUDIO_STREAM, handler=self.__handler.on_received)
        sio.on(SocketEvents.AUDIO_PROCESSING, handler=self.__handler.on_processing)
        sio.on(SocketEvents.AUDIO_COMPLETE, handler=self.__handler.on_complete)
        return







