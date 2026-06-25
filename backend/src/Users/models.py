from sqlalchemy import Column, Integer, String, DateTime, Boolean, BigInteger
from sqlalchemy.sql import func
from src.utils.db import Base


class UserModel(Base):
    __tablename__ = "user_table"

    id = Column(Integer, primary_key=True, index=True)   
    name = Column(String)
    username = Column(String, nullable=False)             
    email = Column(String, unique=True, nullable=False)  
    hash_password = Column(String, nullable=False)        
    mobile_number = Column(BigInteger)


