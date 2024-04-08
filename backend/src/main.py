from typing import Optional
from fastapi import FastAPI
from prisma import Prisma
from pydantic import BaseModel
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, status
from .model import *
from .auth import hash_password, encode_jwt, decode_jwt
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
async def logs(jwt: str, unverified: bool = False):
    decode_jwt(jwt, True)
    logs = await query_logs(db, unverified)
    resp = list(map(lambda vhlog: {
        "user_id": vhlog.userId,
        "log_id": vhlog.id,
        "start_time": vhlog.start,
        "end_time": vhlog.end,
        "description": vhlog.description,
        "verified": vhlog.verified,
        "username": vhlog.user.username
    }, logs))
    return resp

@app.get("/stats")
async def stats(jwt: str):
    decode_jwt(jwt, True)
    res = await get_stats(db)
    return res

@app.get("/log/{log_id}")
async def log(log_id: int):
    log = await query_log(db, log_id)
    return {
        "user_id": log.userId,
        "log_id": log.id,
        "start_time": log.start,
        "end_time": log.end,
        "description": log.description,
        "verified": log.verified
    }

@app.post("/addlog")
async def addlog(jwt: str,  end: str|None=None, start: str|None = None, description: str  = "N/A"):
    if start is None:
        start = datetime.datetime.utcnow().replace(microsecond=0, tzinfo=datetime.timezone.utc).isoformat()
    tmp=decode_jwt(jwt)
    if(tmp[1] == True):
        res = await create_log(db, start, end, tmp[0], description, True)
        return {"msg" : "admin-addlogsuccess", "logid" : res.id}
    else:
        res = await create_log(db, start, end, tmp[0], description, False)
        return {"msg" : "notadmin-addlogsuccess", "logid" : res.id}

class UpdateLogsRequest(BaseModel):
    logIDs: list[int]
    action: str = "verify"

@app.post("/update_logs")
async def update_logs(jwt: str, request: UpdateLogsRequest):
    decode_jwt(jwt, True)
    match request.action:
        case "verify":
            res = await verify_logs(db, request.logIDs)
            return {"msg": "Logs verified successfully", "count": res}
        case "delete":
            res = await delete_logs(db, request.logIDs)
            return {"msg": "Logs deleted successfully", "count": res}
        case _:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid action")

@app.post("/completelog")
async def completelog(jwt:str, logID: int, endtime: str|None = None):
    if endtime is None:
        endtime = datetime.datetime.utcnow().replace(microsecond=0, tzinfo=datetime.timezone.utc).isoformat()
    user_id, is_admin = decode_jwt(jwt)
    res = await update_log(db, logID, endtime, user_id, is_admin)
    return {"msg": "Log completed successfully", "log": res}

@app.get("/mylogs")
async def mylogs(jwt: str):
    user_id, _ = decode_jwt(jwt)
    logs = await query_user_logs(db, user_id)
    return logs
    

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
        return {"jwt": encode_jwt(user), "is_admin": user.is_admin}