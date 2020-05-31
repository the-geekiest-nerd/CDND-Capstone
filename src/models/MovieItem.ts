export interface MovieItem {
  userId: string
  movieId: string
  year: number
  title: string
  watched: boolean
  imdbRating: number
  streamingAt?: string[]
  cast?: string[]
  imageUrl?: string
}
