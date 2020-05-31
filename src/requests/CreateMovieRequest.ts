/**
 * Fields in a request to create a single Movie entry.
 */
export interface CreateMovieRequest {
  title: string
  year: number
  imdbRating: number
  streamingAt?: string[]
  cast?: string[]
}
