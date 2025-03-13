AgenticVoice/
├── server/
│   ├── core/                     # Core configurations
│   │   ├── __init__.py
│   │   ├── config.py             # App configuration
│   │   ├── database.py           # Database connection
│   │   ├── security.py           # Security utilities (JWT, OAuth, etc.)
│   ├── ai/                      # API versioning
│   │   ├── __init__.py
│   │   ├── config.py             # ai configs
│   │   ├── models/               # models 
│   │   │   ├── __init__.py
│   │   │   └── whisper_transcriber_stt.py  
│   │   │   └── synthesizer_tts.py
│   │   │   └── embedding.py
│   │   ├── llm/                  # llms model functions
│   │   │   ├── __init__.py
│   │   │   └── ollama/
│   │   │          └── ollama_generator.py  
│   │   ├── temptaes/                  # llm  templates
│   │   │   ├── __init__.py
│   │   │   └── en_UK.jinja2
│   │   │   └── hi_IN.jinja2
│   │   ├──chains/                  # llms model functions
│   │   │   ├── __init__.py
│   │   │   └── conversation_chain.py
│   │   ├── agents/               # agents
│   │   │   ├── __init__.py
│   │   |   |── voice/             # voice agents
│   │   │        ├── __init__.py
│   │   │        └── conversational.py  
│   │   │        └── english_lang.py
│   │   |   |── crew/             # crew ai agents
│   │   │        ├── __init__.py
│   │   │        └── orschestration.py  
│   │   │        └── translate_agent.py
│   │   ├── tools/                  # tools & apis 
│   │   │   ├── __init__.py
│   │   │   └── google_search_tool.py  
│   │   │   └── youtube_api.py
│   ├── api/                      # API versioning
│   │   ├── __init__.py
│   │   ├── v1/                   # API version 1
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/        # REST endpoints
│   │   │   │   ├── audio.py
│   │   │   │   ├── users.py
│   │   │   │   ├── agents.py
│   │   │   └── router.py         # Main router for v1
│   ├── modules/                  # Feature-based modules
│   │   ├── __init__.py
│   │   ├── conversation/                
│   │   │   ├── __init__.py
│   │   │   ├── conversation.model.py
│   │   │   ├── conversation.schema.py
│   │   │   ├── conversation.service.py
│   ├── controller/               # controller voice
│   │   ├── __init__.py
│   │   ├── index.py              # controller class
│   │   ├── processor.py          # sst to llm to tts processing
│   │   ├── sockets_handlers.py           # sockets io handers
│   │   ├── voice_controller.py           # integrate models and chains
│   ├── utils/                    # Utility functions
│   │   ├── __init__.py
│   │   ├── helpers.py
│   │   ├── file_handler.py
│   │   ├── logger.py
│   │   └── token_manager.py
│   ├── tests/                    # Unit tests
│   │   ├── __init__.py
│   │   ├── test_audio.py
│   │   ├── test_users.py
│   │   ├── test_agents.py
│   ├── alembic/                  # Database migrations
│   ├── .env                      # Environment variables
│   ├── main.py                   # App entry point
│   ├── requirements.txt           # Dependencies
│   ├── Dockerfile                 # Docker setup
│   ├── docker-compose.yml         # Containerized services
│   ├── README.md                  # Documentation
└── .gitignore                     # Git ignore rules
