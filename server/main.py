from core.app import app, sio_app  # Import FastAPI & Socket.IO app
import controller.sockets_handlers


# Mount the Socket.IO app on FastAPI
app.mount("/", sio_app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
