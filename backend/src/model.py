import asyncio
from prisma import Prisma

async def create_user(db, name: str, password: str):
    # Note: do not pass the password as a plain text, preprocess it with bcrypt
    user = await db.user.create({
        "username": name,
        "password": password
    })
    return user

async def query_users(db):
    users = await db.user.find_many()
    return users

async def main():
    db = Prisma()
    users = await query_users(db)
    print(users)

if __name__ == "__main__":
    asyncio.run(main())