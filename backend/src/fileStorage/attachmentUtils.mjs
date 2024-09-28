import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createLogger } from '../utils/logger.mjs'
import AWSXRay from 'aws-xray-sdk-core'

const logger = createLogger('attachmentUtils')

export class AttachmentsManager {
  constructor(
    s3Client = AWSXRay.captureAWSv3Client(new S3Client()),
    bucketName = process.env.ATTACHMENTS_S3_BUCKET,
    urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
  ) {
    this.s3Client = s3Client
    this.bucketName = bucketName
    this.urlExpiration = urlExpiration
  }

  async generatePresignedUrl(attachmentKey) {
    logger.info(`Generate S3 Presigned URL for todoAttachmentKey=${attachmentKey}`, { attachmentKey })
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: attachmentKey
    })
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.urlExpiration
    })
    logger.info(`Presigned URL was successfully created for todoAttachmentKey=${attachmentKey}`, { attachmentKey, url })
    return url
  }

  async deleteAttachment(attachmentKey) {
    logger.info(`Delete attachment from S3 todoAttachmentKey=${attachmentKey}`, { attachmentKey })
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: attachmentKey
    })
    await this.s3Client.send(command)
    logger.info(`Attachment was successfully deeted for todoAttachmentKey=${attachmentKey}`, { attachmentKey })
  }
}
