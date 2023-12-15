"""
This module contains the user authentication related functions.

$ pip install bcrypt

"""
import bcrypt as bcr

import json
from datetime import datetime, timedelta, timezone

from jwt import (
    JWT,
    jwk_from_dict,
    jwk_from_pem,
)
from jwt.utils import get_int_from_datetime

saltRounds = 10


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


def user_signin(name, password) -> str:
    """
    signs in the user and returns a jwt token
    """
    pass




if __name__ == "__main__":

    #hsh = hash_password(myPlaintextPassword)
    #print(hsh)
    myPlaintextPassword = 's0/\/\P4$$w0rD'
    someOtherPlaintextPassword = 'not_bacon'
    verify_password(myPlaintextPassword,hash_password(myPlaintextPassword))
    verify_password(myPlaintextPassword,hash_password(someOtherPlaintextPassword))


