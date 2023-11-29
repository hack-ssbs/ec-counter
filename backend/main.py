from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Goodbye World"}

@app.get("/ping")
async def pong():
    return {"message": "pong"}
