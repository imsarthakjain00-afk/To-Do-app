from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from src.utils.db import Base


class User(Base):
    # This tells SQLAlchemy: "this class = the 'users' table in PostgreSQL"
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)   # Auto-increment ID
    username = Column(String, nullable=False)             # Display name
    email = Column(String, unique=True, nullable=False)  # Login identity (must be unique)
    password_hash = Column(String, nullable=False)        # Hashed password (never plain text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Auto timestamp
