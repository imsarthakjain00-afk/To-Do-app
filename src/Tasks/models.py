from sqlalchemy import Column, Boolean, Integer, Text, String
from src.utils.db import Base

class TaskModel(Base):
    __tablename__ = "User_Tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    status = Column(String, default="Pending")
    priority = Column(String, default="Medium")



