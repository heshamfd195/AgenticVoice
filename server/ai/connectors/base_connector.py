from abc import ABC, abstractmethod

class BaseConnector(ABC):
    def __init__(self, config: dict):
        self.config = config

    @abstractmethod
    def run(self):
        """Execute the connector's main functionality"""
        pass
    

    
