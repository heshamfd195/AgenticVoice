from fastapi import APIRouter
from modules.conversation.conversation_router import conversation_router

# Create a router for API v1
router = APIRouter()

# Include individual endpoint routers
router.include_router(conversation_router, prefix="/conversation", tags=["Conversation"])

