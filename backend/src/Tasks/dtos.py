from pydantic import BaseModel

class Task_schema(BaseModel):
    title: str
    description: str
    status: str = "Pending"
    priority: str = "Medium"

class TaskResponseSchema(BaseModel):
    id:int
    title: str
    description: str
    status: str 
    priority: str
    user_id: int | None = None 

    