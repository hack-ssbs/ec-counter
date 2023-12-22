from fastapi import FastAPI
from prisma import Prisma
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from .model import query_users, create_user
from .auth import hash_password, encode_jwt
from .model import get_user


db = Prisma()

@asynccontextmanager
async def lifespan(_app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost.tiangolo.com",
    "https://ecvh.ssbs.club",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

@app.post("/register")
async def register(name: str, password: str):
    hashed_pw = hash_password(password)
    await create_user(db, name, hashed_pw)
    return {"msg":"ok"}

@app.get("/login")
async def login(name: str, password: str):
        """
        signs in the user and returns a jwt token
        """
        user = await get_user(db, name, hash_password(password))
        if user is None:
            return {"msg": "failed"}
        else:
            return encode_jwt(user)


