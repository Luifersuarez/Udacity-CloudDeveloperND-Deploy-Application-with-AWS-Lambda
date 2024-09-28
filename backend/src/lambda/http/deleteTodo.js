import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { deleteTodo, deleteAttachment } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('deleteTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    logger.info(`Processing deleteTodo event for todoId=${todoId} and userId=${userId}`, { todoId, userId })

    const deletedItem = await deleteTodo(todoId, userId)
    const attachmentUrl = deletedItem.attachmentUrl
    
    // If the deletedTodo has an attachmentUrl delete the document from S3 bucket
    if (attachmentUrl !== undefined) {
      await deleteAttachment(todoId, userId)
    }

    return {
      statusCode: 204,
      body: ''
    }
  })
