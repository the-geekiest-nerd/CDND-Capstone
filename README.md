# Movies API

## Capstone Project for Udacity's Cloud Developer Nanodegree

## API Reference

## Getting Started

This API is a serverless backend deployed on AWS platform using AWS lambda functions.

Base URL: https://qnbcndxle0.execute-api.us-east-2.amazonaws.com/dev/

Authentication: This application requires authentication to perform various actions. All the endpoints require the `Bearer` token.

#### GET /movies

- General
  - gets the list of all the movies

<details>
<summary>Sample Response</summary>

```
{
    "movies": [
        {
            "watched": false,
            "userId": "auth0|5ed3c34bbeb6840c93986006",
            "year": 2019,
            "movieId": "e4ecc54a-0253-40f9-a1da-4aef8df85f1c",
            "imdbRating": 7.5,
            "cast": [
                "Keanu Reaves",
                "Halle Berry",
                "Laurence Fishburne",
                "Mark Dacascos"
            ],
            "title": "John Wick: Chapter 3 – Parabellum"
        },
        {
            "watched": false,
            "userId": "auth0|5ed3c34bbeb6840c93986006",
            "year": 2019,
            "movieId": "e0222ef1-106c-4dcc-8bcf-94b2cf30a186",
            "streamingAt": [
                "Amazon Prime"
            ],
            "imdbRating": 8.5,
            "cast": [
                "Joaquin Phoenix",
                "Robert De Niro",
                "Zazie Beetz",
                "Frances Conroy"
            ],
            "title": "Joker"
        },
        {
            "watched": false,
            "userId": "auth0|5ed3c34bbeb6840c93986006",
            "year": 2018,
            "movieId": "977b7031-f664-4ec3-b008-0cbfc9db3745",
            "streamingAt": [
                "Amazon Prime"
            ],
            "imdbRating": 6.8,
            "cast": [
                "Hailee Steinfeld",
                "John Cena",
                "Jorge Lendeborg Jr.",
                "John Ortiz"
            ],
            "title": "Bumblebee"
        },
        {
            "watched": false,
            "userId": "auth0|5ed3c34bbeb6840c93986006",
            "year": 2019,
            "movieId": "64599558-1484-4f11-aa5f-f46bcd9d7ac2",
            "imdbRating": 6.8,
            "cast": [
                "Charlize Theron",
                "Nicole Kidman",
                "Margot Robbie"
            ],
            "title": "Bombshell"
        }
    ]
}
```

</details>

#### POST /movies

- General

  - creates a new movie

- Request Body

  - title: string, required
  - year: number, required
  - imdbRating: float, required
  - cast: array of string, optional
  - streamingAt: array of string, optional

- Sample Request Body

```
    {
        "title": "Avengers: Endgame",
        "year": 2019,
        "imdbRating": 8.4,
        "streamingAt": ["Hotstar"],
        "cast": ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth", "Scarlett Johansson"]
    }
```

<details>
<summary>Sample Response</summary>

```
{
    "movie": {
        "movieId": "04dc0725-68a7-486d-ac3c-6584f4682054",
        "userId": "auth0|5ed3c34bbeb6840c93986006",
        "title": "Avengers: Endgame",
        "year": 2019,
        "imdbRating": 8.4,
        "cast": [
            "Robert Downey Jr.",
            "Chris Evans",
            "Mark Ruffalo",
            "Chris Hemsworth",
            "Scarlett Johansson"
        ],
        "streamingAt": [
            "Hotstar"
        ],
        "watched": false
    }
}
```

</details>

#### PATCH /movie/{movieId}

- General

  - updates the info for a movie

- Request Body

  - imdbRating: number, required
  - watched: boolean, required

- Sample Request Body

```
    {
        "imdbRating": 9.0,
        "watched": true
    }
```

<details>
<summary>Sample Response</summary>

```
{
    "statusMessage": "Movie updated successfully"
}
```

</details>

#### DELETE /movies/{movieId}

- General

  - deletes the movie

<details>
<summary>Sample Response</summary>

```
{
    "statusMessage": "Movie removed successfully"
}
```

</details>

#### POST /movies/{movieId}/image

- General

  - returns a S3 signed URL which can be then used to upload an image related to the movie
  - URL expires in 300 seconds (5 minutes)
  - imageUrl is the URL that is stored in dynamodb table
  - imageUploadUrl can be used to upload the image file directly to S3 (via a PUT call)

<details>
<summary>Sample Response</summary>

```
{
    "imageUrl": "https://s3-ry-movies-poster-dev.s3.amazonaws.com/b50107a7-a9e1-4209-b254-dc7aa25c6ec1",
    "imageUploadUrl": "https://s3-ry-movies-poster-dev.s3.us-east-2.amazonaws.com/b50107a7-a9e1-4209-b254-dc7aa25c6ec1?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAZ3JQG66VORUBLKUN%2F20200531%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20200531T170332Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMiJIMEYCIQCyPjh%2BQFf366g0eeAyLUNOvFde%2FaFqXeVZhXbZzgjVCgIhALt7ET2r1e3p0WOm1XFGXhP7HfQKeAk4Nck7HXUmNUGrKt8BCDIQARoMNjc3MDk1MzM5OTQ2Igyezx4MB98Wx9P9aMMqvAGT6nfEBqxVgKReYi1hhkd%2BEuYZ6Yb1A9vMgdPhUW2LIMJ9g2A2ccjeaMgvKNX7SfETc8a%2F%2BIlKXBMKVPNI3WTCP%2BXEABHtRK4Drone1z1g6ZH2SpM1R%2BtXV53al26j8RkTpLM9pnMLtZLCKHuG57y%2BeJPwRKrkNYAKVHHZL2eYAd%2BluZ%2FIcwHdkMyfgQSxNtvD153sbZvY%2FMd9N7l%2FDytMBvrlFnZf9eVjWTBMAtPMmNRc%2BNk%2Brb%2F5gWIz0jDSxs%2F2BTrfAafq2JNryvAW0ejJRG3dajHdPUokEJZf8tRJV%2F1thbeLPqqC1lXW4yhBMhgak1uGxwhYikqWeNBXzOZAuiFIfadJt9ljgxZyFOt%2BSZitiX2fq%2FTHRQkI0kTbFduyyZv1JNQSS34Fp9irMiVMGNl6XCMwedwWqVM%2B3WKOwje98aFf4dGZHSSBC%2FdpJAt9gOVp8FiGPPXzN03Kd9yhvOhR4RzNC0dfyw4c6ZbM2IJYBWEh8QVGeNb08JOBpXbhJOIIRDqaplhW6m0m6Ssw%2FNR9ljB0kpa3oditOrmdmfRI4v0%3D&X-Amz-Signature=a36f20a8f3b252d2904cf1d54a6ebd1fe0dd88ef749a47b83be6e357ae7b63b6&X-Amz-SignedHeaders=host"
}
```

</details>
