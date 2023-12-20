"""
This module contains the user authentication related functions.
"""
import os
import bcrypt as bcr
from prisma import Prisma
from prisma.models import User
import json
import jwt
from jwt import InvalidSignatureError
from fastapi import HTTPException, status

from .model import get_user

saltRounds = 10
JWT_SECRET = os.getenv("JWT_SECRET") | "JWT_SECRET_FOR_TESTING"
API_KEY = os.getenv("API_KEY") | "API_KEY_FOR_TESTING"

def hash_password(pw: str) -> str:
    """
    hash the password with bcrypt
    """

    hsh = bcr.hashpw(pw.encode(),bcr.gensalt())

    return hsh
    # for string output testing
    # write line 33 (line above) as "return str(hsh)"

def verify_password(pw, hash) -> bool:
    """
    verify the password with bcrypt
    """
    return bcr.checkpw(pw.encode(), hash)


def encode_jwt(usr: User):
    return jwt.encode(
        {"user_id": usr.id, "is_admin": usr.is_admin},
        JWT_SECRET,
        algorithm="HS256"
    )

def decode_jwt(encoded: str) -> (str, bool):
    try:
        decoded = jwt.decode(encoded, JWT_SECRET, algorithms=["HS256"])
        if not ("user_id" in decoded and "is_admin" in decoded):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "the required fields of user_id or is_admin is not present in provided JWT!")
        return decoded["user_id"], decoded["is_admin"]
    except InvalidSignatureError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid Signature for JWT!")
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Unknown Error: {e}")


if __name__ == "__main__":
    myPlaintextPassword = 's0/\/\P4$$w0rD'
    someOtherPlaintextPassword = 'not_bacon'
    verify_password(myPlaintextPassword,hash_password(myPlaintextPassword))
    verify_password(myPlaintextPassword,hash_password(someOtherPlaintextPassword))
