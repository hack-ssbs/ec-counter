"""
This module contains the user authentication related functions.
"""


SALT = "..."

def hash_password(pw) -> str:
    """
    hash the password with bcrypt
    """
    return str(hash(pw))

def verify_password(pw, hash):
    """
    verify the password with bcrypt
    """
    pass

def user_signin(name, password) -> str:
    """
    signs in the user and returns a jwt token
    """
    pass


if __name__ == "__main__":
    print(hash_password("rand pw"))