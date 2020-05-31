import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { MovieItem } from '../models/MovieItem'
import { MovieUpdate } from '../models/MovieUpdate'

export class MovieAccessModel {
  public constructor(
    private readonly documentClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly moviesTable = process.env.MOVIES_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  ) {}

  public async getAllMovies(userId: string): Promise<MovieItem[]> {
    const result = await this.documentClient
      .query({
        TableName: this.moviesTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
        ScanIndexForward: false
      })
      .promise()

    const items = result.Items
    return items as MovieItem[]
  }

  public async getMovieById(movieId: string): Promise<MovieItem> {
    const result = await this.documentClient
      .query({
        TableName: this.moviesTable,
        KeyConditionExpression: 'movieId = :movieId',
        ExpressionAttributeValues: { ':movieId': movieId }
      })
      .promise()

    const item = result.Items[0]
    return item as MovieItem
  }

  public async createMovie(movieItem: MovieItem): Promise<MovieItem> {
    await this.documentClient
      .put({ TableName: this.moviesTable, Item: movieItem })
      .promise()

    return movieItem
  }

  public async updateMovie(
    movieId: string,
    movieUpdate: MovieUpdate
  ): Promise<void> {
    this.documentClient
      .update({
        TableName: this.moviesTable,
        Key: { movieId },
        UpdateExpression: 'set imdbRating = :imdbRating, watched = :watched',
        ExpressionAttributeValues: {
          ':imdbRating': movieUpdate.imdbRating,
          ':watched': movieUpdate.watched
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()
  }

  public async setMovieImageUrl(
    movieId: string,
    imageUrl: string
  ): Promise<void> {
    this.documentClient
      .update({
        TableName: this.moviesTable,
        Key: { movieId },
        UpdateExpression: 'set imageUrl = :imageUrl',
        ExpressionAttributeValues: { ':imageUrl': imageUrl },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()
  }

  public async deleteMovie(movieId: string): Promise<void> {
    this.documentClient
      .delete({ TableName: this.moviesTable, Key: { movieId } })
      .promise()
  }
}
