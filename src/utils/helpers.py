from fastapi import Request, status, HTTPException, Depends
from sqlalchemy.orm import Session
import jwt
from src.utils.settings import settings
from jwt.exceptions import InvalidTokenError
from src.Users.models import UserModel
from src.utils.db import get_db


def is_authenticated(request:Request, db:Session = Depends(get_db)):
    """
    This function checks if the user is authenticated.
    """
    try:
        token = request.headers.get("Authorization")
        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No Token provided...")
        
        token = token.split(" ")[-1]

        data = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
        user_id = data.get("_id")
        
        user = db.query(UserModel).filter(UserModel.id==user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found...")

        return user
    except InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Token...")