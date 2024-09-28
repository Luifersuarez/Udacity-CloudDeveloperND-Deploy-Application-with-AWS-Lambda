import { v4 as uuidv4 } from 'uuid'
import { TodosManager } from '../dataLayer/todosAccess.mjs'
import { AttachmentsManager } from  '../fileStorage/attachmentUtils.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todos')
const todosManager = new TodosManager()
const attachmentsManager = new AttachmentsManager()

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
  const deletedItem = await todosManager.deleteTodo(todoId, userId)
  logger.info(`Successfully deleted TODO Item with todoId=${todoId} for user=${userId}`, { todoId, userId })
  return deletedItem
}

export async function generateUploadUrl(todoId, userId) {

  logger.info(`Generate Upload URL for Attachment of TODO Item with todoId=${todoId} for user=${userId}`, { todoId, userId })
  const attachmentKey = `${userId}/${todoId}`
  const url = await attachmentsManager.generatePresignedUrl(attachmentKey)
  logger.info(`Successfully generated Upload URL for Attachment of TODO Item with todoId=${todoId} for user=${userId}`, { todoId, userId, url })
  return url
}

export async function updateTodoAttachmentUrl(url, todoId, userId) {

  logger.info(`Update todoAttachmentUrl with todoId=${todoId} for user=${userId}`, { todoId, userId, url })
  const updatedItem = await todosManager.updateTodoAttachmentUrl({
    todoId,
    userId,
    attachmentUrl: url
  })
  logger.info(`Updated successfully todoAttachmentUrlwith todoId=${todoId} for user=${userId}`, { todoId, userId, updatedItem })
}

export async function deleteAttachment(todoId, userId) {
  logger.info(`Delete attachment for TODO Item with todoId=${todoId} for user=${userId}`, { todoId, userId })
  const attachmentKey = `${userId}/${todoId}`
  await attachmentsManager.deleteAttachment(attachmentKey)
  logger.info(`Deleted successfully the attachment for TODO Item with todoId=${todoId} for user=${userId}`, { todoId, userId })
}