from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.Tasks.models import TaskModel
from src.Tasks.dtos import Task_schema
from src.Tasks.db_queries import (
    create_task_query,
    get_all_tasks_query,
    get_task_by_id_query,
    update_task_query,
    delete_task_query
)

from src.Users.models import UserModel


def create_task_service(
    user_data: Task_schema,
    db: Session,
    user: UserModel
):

    new_task = TaskModel(
        title=user_data.title,
        description=user_data.description,
        status=user_data.status,
        priority=user_data.priority,
        user_id=user.id
    )

    return create_task_query(new_task, db)


def get_tasks_service(
    db: Session,
    user: UserModel
):

    return get_all_tasks_query(user.id, db)


def get_one_task_service(
    task_id: int,
    db: Session
):

    task = get_task_by_id_query(task_id, db)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task ID is not Found"
        )

    return task


def update_task_service(
    user_data: Task_schema,
    task_id: int,
    db: Session,
    user: UserModel
):

    task = get_task_by_id_query(task_id, db)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task ID is not Found"
        )

    if task.user_id != user.id:
        raise HTTPException(
            status_code=401,
            detail="You are not authorized to update this task"
        )

    data = user_data.model_dump()

    for field, value in data.items():
        setattr(task, field, value)

    return update_task_query(task, db)


def delete_task_service(
    task_id: int,
    db: Session,
    user: UserModel
):

    task = get_task_by_id_query(task_id, db)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task ID is not Found"
        )

    if task.user_id != user.id:
        raise HTTPException(
            status_code=401,
            detail="You are not authorized to delete this task"
        )

    delete_task_query(task, db)

    return None