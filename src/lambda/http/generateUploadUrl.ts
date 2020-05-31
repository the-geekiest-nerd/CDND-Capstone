import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import {
  setMovieImageUrl,
  getMovieById
} from '../../businessLogic/movieController'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateSignedImageURLHandler')
const bucketName = process.env.S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const generateSignedImageURLHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const movieId = event.pathParameters.movieId
  logger.info(`Attaching image to movie: ${movieId}`)
  const movieEntry = await getMovieById(movieId)

  if (!movieEntry) {
    logger.error(`No movie with id ${movieId} exists`)
    return {
      statusCode: 404,
      body: JSON.stringify({
        statusMessage: 'No such movie exists'
      })
    }
  }

  const userId = getUserId(event)
  if (movieEntry.userId !== userId) {
    logger.error(`Movie with id ${movieId} does not belong to user ${userId}`)
    return {
      statusCode: 403,
      body: JSON.stringify({
        statusMessage:
          'User does not have sufficient permission to add image to this movie'
      })
    }
  }

  const imageId = uuid.v4()
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
  setMovieImageUrl(movieId, imageUrl)
  logger.info(`Attached image url to movie: ${movieId}`)
  logger.info('Generating signed url for S3 upload')

  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })

  return {
    statusCode: 201,
    body: JSON.stringify({
      imageUrl: imageUrl,
      imageUploadUrl: url
    })
  }
}

export const handler = middy(generateSignedImageURLHandler).use(
  cors({ credentials: true })
)
