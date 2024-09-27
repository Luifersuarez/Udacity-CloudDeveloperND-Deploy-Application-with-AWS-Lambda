import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('createTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event)
    logger.info(`Processing createTodo event for userId=${userId}`, { userId, body: event.body })
    const newTodoBody = JSON.parse(event.body)

    const newTodoItem = await createTodo(newTodoBody, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({ item: newTodoItem })
    }
  })
