from fastapi import FastAPI
from src.utils.db import Base, engine
from src.Tasks.models import TaskModel
from src.Users.models import UserModel
from src.Tasks.routers import task_routes
from src.Users.routers import user_routes

Base.metadata.create_all(engine)

app = FastAPI(title="This is a TO-DO Application")

app.include_router(task_routes)
app.include_router(user_routes)




