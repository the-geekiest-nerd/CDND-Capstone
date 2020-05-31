import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { CreateMovieRequest } from '../../requests/CreateMovieRequest'
import { createMovie } from '../../businessLogic/movieController'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createMovieHandler')

const createMovieHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newMovie: CreateMovieRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  logger.info(`Adding new movie item for user ${userId}`)
  const newMovieEntry = await createMovie(newMovie, userId)
  logger.info(
    `Successfully added movie with id ${newMovieEntry.movieId} for user ${newMovieEntry.userId}`
  )

  return {
    statusCode: 201,
    body: JSON.stringify({ movie: newMovieEntry })
  }
}

export const handler = middy(createMovieHandler).use(
  cors({ credentials: true })
)
