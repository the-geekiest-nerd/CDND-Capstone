import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { UpdateMovieRequest } from '../../requests/UpdateMovieRequest'
import { updateMovie, getMovieById } from '../../businessLogic/movieController'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateMovieHandler')

const updateMovieHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const movieId = event.pathParameters.movieId
  logger.info(`Updating movie: ${movieId}`)
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
          'User does not have sufficient permission to update this movie'
      })
    }
  }

  const updatedMovieEntry: UpdateMovieRequest = JSON.parse(event.body)
  await updateMovie(movieId, updatedMovieEntry)
  logger.info(`Updated movie ${movieId} successfully`)

  return {
    statusCode: 200,
    body: JSON.stringify({
      statusMessage: 'Movie updated successfully'
    })
  }
}

export const handler = middy(updateMovieHandler).use(
  cors({ credentials: true })
)
