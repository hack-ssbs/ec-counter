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
JWT_SECRET = os.getenv("JWT_SECRET") or "JWT_SECRET_FOR_TESTING"
API_KEY = os.getenv("API_KEY") or "API_KEY_FOR_TESTING"
HASH_SALT = b'$2b$12$2ixtqK6nsdub0jBh5hoFlu'

def hash_password(pw: str) -> str:
    """
    hash the password with bcrypt
    """

    hsh = bcr.hashpw(pw.encode(),HASH_SALT)
    return hsh.decode()
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

def decode_jwt(encoded: str, force_admin: bool = False) -> (str, bool):
    try:
        decoded = jwt.decode(encoded, JWT_SECRET, algorithms=["HS256"])
        if not ("user_id" in decoded and "is_admin" in decoded):
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "the required fields of user_id or is_admin is not present in provided JWT!")
        if force_admin and not decoded["is_admin"]:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Admin privileges required.")
        return decoded["user_id"], decoded["is_admin"]
    except InvalidSignatureError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid Signature for JWT!")
    except Exception as e:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, f"Unknown Error: {e}")


if __name__ == "__main__":
    # myPlaintextPassword = 's0/\/\P4$$w0rD'
    # someOtherPlaintextPassword = 'not_bacon'
    # verify_password(myPlaintextPassword,hash_password(myPlaintextPassword))
    # verify_password(myPlaintextPassword,hash_password(someOtherPlaintextPassword))
    # myUser = User(id="clrbhcufh0000rkdc9ohkjaso", username="Claire Zhao", password = "123456",is_admin = True)
    # myUser = User(id="clpl728xq0000phw0gzspt2y4", username="test", password = "test",is_admin = False)
    # myEncUserID = encode_jwt(myUser)
    # print(myEncUserID)
    pass
