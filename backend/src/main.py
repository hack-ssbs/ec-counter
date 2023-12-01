from fastapi import FastAPI
from prisma import Prisma
from contextlib import asynccontextmanager
from .model import create_user, query_users

db = Prisma()

@asynccontextmanager
async def lifespan(_app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/ping")
async def pong():
    return {"message": "pong"}

@app.get("/users")
async def users():
    # get a list of all users, this is a sample usecase of our database model.
    users = await query_users(db)
    resp = list(map(lambda user: {
        "id": user.id,
        "username": user.username,
        "is_admin": user.is_admin
    }, users))
    return resp
