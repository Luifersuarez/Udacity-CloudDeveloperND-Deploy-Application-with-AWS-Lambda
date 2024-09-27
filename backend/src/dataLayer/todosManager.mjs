import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todosManager')

export class TodosManager {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.dynamoDbClient = DynamoDBDocument.from(documentClient)
    this.todosTable = todosTable
  }

  async getAllTodosByUserId(userId) {

    logger.info('Getting list of TODOs', { userId })

    const result = await this.dynamoDbClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
        ':userId': userId
        },
    })

    logger.info(`${result.Count} TODOs found`, { userId })

    const items = result.Items
    return items
  }

  async createTodo(todoItem) {
    
    logger.info('Adding a TODO', { todoItem })
    await this.dynamoDbClient.put({
        TableName: this.todosTable,
        Item: todoItem
      })
    logger.info('TODO saved successfully', { todoId: todoItem.todoId })
    return todoItem
  }

  async updateTodo(todoItem) {
    logger.info('Updating a TODO', { todoItem })
    
    const updatedItem = await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Key: { 
          userId: todoItem.userId,
          todoId: todoItem.todoId
        },
        ExpressionAttributeNames: { "#name": "name" },
        UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeValues: {
          ":name": todoItem.name,
          ":dueDate": todoItem.dueDate,
          ":done": todoItem.done
        },
        ReturnValues: "UPDATED_NEW"
      })
    logger.info('TODO updated successfully', { todoId: todoItem.todoId , updatedItem})
    return updatedItem
  }

  async deleteTodo(todoId, userId) {
    logger.info('Deleting a TODO', { todoId })
    
    await this.dynamoDbClient.delete({
        TableName: this.todosTable,
        Key: { 
          userId: userId,
          todoId: todoId
        },
      })
    logger.info('TODO deleted successfully', { todoId })
  }



}