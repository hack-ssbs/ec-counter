"""
We put all database operations in this file.
The below `create_user` and `query_user` functions are examples of how to create database operations.
Note that we use the dependency injection pattern to pass the database instance to the functions, as the first argument.
Also note that we use the `await` keyword to wait for the database operations to finish.
"""

import asyncio
import datetime
from prisma import Prisma
from prisma.models import User
from prisma.models import VhLog
from prisma.errors import UniqueViolationError
from fastapi import HTTPException, status

async def query_logs(db: Prisma):
    logs=await db.vhlog.find_many()
    return logs

async def log_exists(db: Prisma, start: str, end: str, userId: str, description: str) ->bool:
    existing_log = await db.vhlog.find_first(
        where={
            "start": start,
            "end": end,
            "userId": userId,
            "description": description
        }
    )
    return existing_log is not None

async def create_log(db: Prisma, start: str, end: str, userId: str, description: str, verified: bool) -> VhLog:
    if await log_exists(db, start, end, userId, description):
        raise HTTPException(status.HTTP_409_CONFLICT, "Log already exists.")
    else:
        log = await db.vhlog.create({
            "start": start,
            "end": end,
            "userId": userId,
            "description": description,
            "verified": verified
        })
        return log

async def create_user(db: Prisma, name: str, password: str):
    # Note: do not pass the password as a plain text, preprocess it with bcrypt
    try:
        user = await db.user.create({
            "username": name,
            "password": password
        })
        return user
    except UniqueViolationError:
        raise HTTPException(status.HTTP_409_CONFLICT, "A user with such username already exists.")

async def query_users(db: Prisma):
    users = await db.user.find_many()
    return users

async def get_user(db: Prisma, username:str, password:str) -> User | None:
    return await db.user.find_first(where={
        "username": username,
        "password": password
    })

async def set_admin(db: Prisma, username: str) -> bool:
    res = await db.user.update(
        {'is_admin': True},
        where={'username': username}
    )
    return res is not None

async def tst_main():
    db = Prisma()
    await db.connect()
    res = await set_admin(db, "jettchen")
    print(res)
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(tst_main())