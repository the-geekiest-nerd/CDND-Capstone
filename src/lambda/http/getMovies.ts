import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { getAllMovies } from '../../businessLogic/movieController'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getAllMoviesHandler')

const getAllMoviesHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  logger.info(`Fetching all movies for user: ${userId}`)
  const movies = await getAllMovies(userId)
  logger.info(`Fetch completed for all movies for user: ${userId}`)

  return {
    statusCode: 200,
    body: JSON.stringify({ movies })
  }
}

export const handler = middy(getAllMoviesHandler).use(
  cors({ credentials: true })
)
