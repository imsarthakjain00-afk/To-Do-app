from fastapi import FastAPI
from src.utils.db import Base, engine
from src.Tasks.models import TaskModel

Base.metadata.create_all(engine)

app = FastAPI(title="This is a TO-DO Application")



