import * as uuid from 'uuid'

import { MovieItem } from '../models/MovieItem'
import { MovieAccessModel } from '../databaseAccess/movieAccess'
import { CreateMovieRequest } from '../requests/CreateMovieRequest'
import { UpdateMovieRequest } from '../requests/UpdateMovieRequest'

const movieAccessModel = new MovieAccessModel()

export async function getMovieById(movieId: string): Promise<MovieItem> {
  return movieAccessModel.getMovieById(movieId)
}

export async function getAllMovies(userId: string): Promise<MovieItem[]> {
  return movieAccessModel.getAllMovies(userId)
}

export async function createMovie(
  createMovieRequest: CreateMovieRequest,
  userId: string
): Promise<MovieItem> {
  const itemId = uuid.v4()

  return movieAccessModel.createMovie({
    movieId: itemId,
    userId: userId,
    title: createMovieRequest.title,
    year: createMovieRequest.year,
    imdbRating: createMovieRequest.imdbRating,
    cast: createMovieRequest.cast,
    streamingAt: createMovieRequest.streamingAt,
    watched: false
  })
}

export async function updateMovie(
  movieId: string,
  updateMovieRequest: UpdateMovieRequest
): Promise<void> {
  await movieAccessModel.updateMovie(movieId, updateMovieRequest)
}

export async function deleteMovie(movieId: string): Promise<void> {
  await movieAccessModel.deleteMovie(movieId)
}

export async function setMovieImageUrl(
  movieId: string,
  imageUrl: string
): Promise<void> {
  await movieAccessModel.setMovieImageUrl(movieId, imageUrl)
}
