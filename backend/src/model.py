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
from dotenv import load_dotenv

async def query_logs(db: Prisma, unverified: bool = False):
    filt = {}
    if unverified:
        filt.update({"verified": False}) 
    logs=await db.vhlog.find_many(
        where=filt,
        include={"user": True}
    )
    return logs

async def query_log(db: Prisma, log_id: int):
    log = await db.vhlog.find_first(where={"id": log_id})
    if log:
        return log
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Log not found.")

async def query_user_logs(db: Prisma, user_id: str):
    logs=await db.vhlog.find_many(where={"userId": user_id})
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

async def update_log(db: Prisma, logID: int, end: str, user_id: str, is_admin: bool):
    updated_log = await db.vhlog.update(
        where = {"id": logID} if is_admin else {"id": logID, "userId": user_id},
        data = {"end": end}
    )
    if updated_log:
        return updated_log
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Log not found.")

async def verify_logs(db: Prisma, logIDs: list[int]):
    res = await db.vhlog.update_many(
        where={"id": {"in": logIDs}},
        data={"verified": True}
    )
    if res:
        return res
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Log not found.")

async def delete_logs(db: Prisma, logIDs: list[int]):
    res = await db.vhlog.delete_many(
        where={"id": {"in": logIDs}}
    )
    return res

async def create_user(db: Prisma, name: str, password: str) :
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

async def get_stats(db: Prisma):
    results = await db.query_raw(
        '''
        SELECT
            u.username,
            SUM(EXTRACT(EPOCH FROM (v.end - v.start)) / 3600) AS total_hours
        FROM
            "User" u
        JOIN
            "VhLog" v ON u.id = v."userId"
        WHERE
            v.end IS NOT NULL AND v.verified = true
        GROUP BY
            u.id, u.username
        ORDER BY
            total_hours DESC;
        '''
    )
    return results

async def tst_main():
    db = Prisma()
    await db.connect()
    res = await get_stats(db)
    print(res)
    for r in res:
        print(r)
    await db.disconnect()

def get_results():
    db = Prisma()
    asyncio.run(db.connect())
    res = asyncio.run(get_stats(db))
    asyncio.run(db.disconnect())
    return res

if __name__ == "__main__":
    asyncio.run(tst_main())