import { v4 as uuidv4 } from 'uuid'
import { TodosManager } from '../dataLayer/todosManager.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todos')
const todosManager = new TodosManager()

export async function getTodos(userId) {
  logger.info(`Get all TODO Items for user=${userId}`, { userId })
  return await todosManager.getAllTodosByUserId(userId)
}

export async function createTodo(payload, userId) {
  const todoId = uuidv4()
  logger.info(`Create TODO Item with todoId=${todoId} for user=${userId}`, { todoId, userId })
  return await todosManager.createTodo({
    todoId: todoId,
    userId: userId,
    attachmentUrl: null,
    createdAt: new Date().toISOString(),
    done: false,
    ...payload
  })
}

export async function updateTodo(todoId, payload, userId) {

  logger.info(`Update TODO Item with todoId=${todoId} for user=${userId}`, { todoId, userId, payload })
  const updatedItem = await todosManager.updateTodo({
    todoId,
    userId,
    ...payload
  })
  logger.info(`Updated successfully TODO Item with todoId=${todoId} for user=${userId}`, { todoId, userId, updatedItem })
}

export async function deleteTodo(todoId, userId) {

  logger.info(`Delete TODO Item with todoId=${todoId} for user=${userId}`, { todoId, userId })
  await todosManager.deleteTodo(todoId, userId)
  logger.info(`Successfully deleted TODO Item with todoId=${todoId} for user=${userId}`, { todoId, userId })
}