from src.Tasks.services import (
    create_task_service,
    get_tasks_service,
    get_one_task_service,
    update_task_service,
    delete_task_service
)


def create_task(user_data, db, user):
    return create_task_service(user_data, db, user)


def get_tasks(user_data, db, user):
    return get_tasks_service(user_data, db, user)


def get_one_task(task_id, db):
    return get_one_task_service(task_id, db)


def update_task(user_data, task_id, db, user):
    return update_task_service(user_data, task_id, db, user)


def delete_task(task_id, db, user):
    return delete_task_service(task_id, db, user)