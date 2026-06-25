from sqlalchemy.orm import Session
from src.Tasks.models import TaskModel


def create_task_query(task: TaskModel, db: Session):
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_all_tasks_query(user_id: int, db: Session):
    return (
        db.query(TaskModel)
        .filter(TaskModel.user_id == user_id)
        .all()
    )


def get_task_by_id_query(task_id: int, db: Session):
    return db.query(TaskModel).get(task_id)


def update_task_query(task: TaskModel, db: Session):
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def delete_task_query(task: TaskModel, db: Session):
    db.delete(task)
    db.commit()