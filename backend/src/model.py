"""
We put all database operations in this file.
The below `create_user` and `query_user` functions are examples of how to create database operations.
Note that we use the dependency injection pattern to pass the database instance to the functions, as the first argument.
Also note that we use the `await` keyword to wait for the database operations to finish.
"""

import asyncio
from prisma import Prisma

async def create_user(db: Prisma, name: str, password: str):
    # Note: do not pass the password as a plain text, preprocess it with bcrypt
    user = await db.user.create({
        "username": name,
        "password": password
    })
    return user

async def query_users(db: Prisma):
    users = await db.user.find_many()
    return users

async def tst_main():
    db = Prisma()
    await db.connect()
    users = await query_users(db)
    print(users)
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(tst_main())