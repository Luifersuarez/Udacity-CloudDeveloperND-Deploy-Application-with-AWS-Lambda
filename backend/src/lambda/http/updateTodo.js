import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('updateTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId;
    logger.info(`Processing updateTodo event for todoId=${todoId} and userId=${userId}`, { todoId, userId })
    const updatedTodo = JSON.parse(event.body)

    await updateTodo(todoId, updatedTodo, userId)

    return {
      statusCode: 200,
      body: ''
    }
  })
