from fastapi import FastAPI
from prisma import Prisma
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, status
from .model import query_users, create_user, query_logs, create_log
from .auth import hash_password, encode_jwt
from .model import get_user
import datetime

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
    "http://localhost:5173",
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

@app.get("/logs")
async def logs():
    #get a list of logs
    logs = await query_logs(db)
    resp = list(map(lambda vhlog: {
        "user_id": vhlog.userId,
        "log_id": vhlog.id,
        "start_time": vhlog.start,
        "end_time": vhlog.end,
        "description": vhlog.description,
        "verified": vhlog.verified
    }, logs))
    return resp

@app.post("/addlog")
async def addlog(userID: str, start: str, end: str = datetime.datetime.utcnow().replace(microsecond=0, tzinfo=datetime.timezone.utc).isoformat(), description: str  = "N/A", verified: bool = False):
    await create_log(db, start, end, userID, description, verified)
    return {"msg" : "addlogsuccess"}

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
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "No user with matching username and password found.")
        else:
            return {"jwt": encode_jwt(user)}