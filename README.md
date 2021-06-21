# gregbomkamp-api

Fun Lambda API used for fun integrations with Spotify/Instagram/IMDB/etc. Eventually will integrate in personal site [gregbomkamp.dev](https://gregbomkamp.dev)

# OpenAPI Documentation

See my [OpenAPI Docs](https://cmntvlz4yc.execute-api.us-east-1.amazonaws.com/)

# Tools/Technology

- AWS CDK
- AWS Lambda
- AWS HttpApi
- OpenAPI 3.0.0
- Projen
- @vendia/serverless-express
- Webpack

# Run the API Locally

```sh
mv .env.example .env # fill out values with your spotify client creds to make spotify queries
npm run local
```

# Deploy

`npm run deploy`

# Considerations

## Spotify

### Identity/Authorization Flow

#### Problem

Spotify does not support applying scopes to an applications client credentials, so I can't authorize my app to read from my personal metrics endpoints to display when users visit my site (under the traditional client credentials flow.)

Incredibly awkward to use the authorization code flow here, but that's the [suggested solution from spotify's API documentation](https://developer.spotify.com/documentation/general/guides/authorization-guide/#frequently-asked-questions)

> **Accessing your data without showing a login form**

>*I want to interact with the web API and show some data on my website. I see that the endpoints I require authorization, but I don’t need/want a login window to pop-up, because I want to grant my own app access to my own playlists once. Is there any way of doing this?*

>You basically need an access token and a refresh token issued for your user account. To obtain a pair of access token - refresh token, follow the Authorization Code Flow (if you need a certain scope to be approved) or Client Credentials (if you just need to sign your request, like when fetching a certain playlist). Once you obtain them, you can use your access token and refresh it when it expires without having to show any login form.

#### Solution

1. Setup my deployed environment /callback endpoint to allow Spotify Identity Protocol to pass an authorization code
1. Locally invoke the authorization code flow through the `/spotify/login` endpoint
1. Exchange the authorization code for a _refresh_ token (not an access token)
1. Deploy my lambda with the refresh token in addition to the client id/secret
1. Use the refresh token (no expiration) + client credentials to get unlimited access tokens

#### Issues

1. Initially creates a circular dependency where I have to deploy the app to get a valid callback endpoint, use the callback to run halfway through the authorization code flow to get a token, then locally get the first refresh token, & finally deploy the lambda with that as part of the environment.
