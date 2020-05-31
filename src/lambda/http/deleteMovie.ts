import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteMovie, getMovieById } from '../../businessLogic/movieController'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteMovieHandler')

const deleteMovieHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const movieId = event.pathParameters.movieId
  logger.info(`Deleting movie: ${movieId}`)
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
          'User does not have sufficient permission to delete this movie'
      })
    }
  }

  await deleteMovie(movieId)
  logger.info(`Successfully deleted movie: ${movieId}`)

  return {
    statusCode: 200,
    body: JSON.stringify({
      statusMessage: 'Movie removed successfully'
    })
  }
}

export const handler = middy(deleteMovieHandler).use(
  cors({ credentials: true })
)
