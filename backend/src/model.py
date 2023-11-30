import asyncio
from prisma import Prisma

async def get_users():
    db = Prisma()
    await db.connect()
    users = await db.user.find_many()
    await db.disconnect()
    return users


async def create_user(name: str, password: str):
    # Note: do not pass the password as a plain text, preprocess it with bcrypt
    db = Prisma()
    await db.connect()
    user = await db.user.create({
        "username": name,
        "password": password
    })
    await db.disconnect()

async def main():
    await create_user("test", "test")
    users = await get_users()
    print(users)

if __name__ == "__main__":
    asyncio.run(main())