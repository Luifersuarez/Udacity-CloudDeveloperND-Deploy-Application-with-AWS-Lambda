import middy from '@middy/core'
import { updateTodoAttachmentUrl } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('updateAttachmentUrl')

async function processRecord(record) {
    const key = decodeURIComponent(record.s3.object.key)
    const bucketName = record.s3.bucket.name
    logger.info(`Processing attachment with key=${key} and bucketName=${bucketName}`, { key, bucketName })

    // Get userId and todoId from the object key
    const [ userId, todoId ] = key.split('/')
    const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
    // Update Todo with the new attachmentUrl
    await updateTodoAttachmentUrl(url, todoId, userId);
}

export const handler = middy()
  .handler(async (event) => {
    logger.info('Processing S3 event', { event })
    for (const record of event.Records) {
        await processRecord(record)
      }
    logger.info('Successfully processed S3 event', { event })
  })
