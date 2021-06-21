import { Request, Response } from 'express';
import Spotify from 'spotify-web-api-node';

let authorization = {
  access_token: '',
  expires_at: new Date().toISOString(),
};

export const login = (req: Request, res: Response) => {
  const url = new Spotify(getSpotifyCredentials()).createAuthorizeURL(
    [
      'user-library-read',
      'user-read-recently-played',
      'user-top-read',
      'user-read-playback-position',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-follow-read',
      'user-library-read',
    ],
    'some-state-akjsdbasjhASJDHjhvASDbkjhlbLJKHASDBJHLASDJBHkjlnfgbkjgbfdsIUisdhASJDHB',
    false,
  );
  res
    .status(302)
    .redirect(
      url +
        `&redirect_uri=${req.protocol + '://' + req.hostname}/spotify/callback`,
    );
};

export const callback = async (
  code: string,
  redirectUri: string,
): Promise<any> => {
  return (
    await new Spotify({
      ...getSpotifyCredentials(),
      redirectUri,
    }).authorizationCodeGrant(code)
  ).body;
};

/**
 * See readme on why I have a refresh token preconfigured in the environment :(
 *
 * @returns
 */
const getSpotifyCredentials = () => {
  if (
    !process.env.SPOTIFY_CLIENT_ID ||
    !process.env.SPOTIFY_CLIENT_SECRET ||
    !process.env.SPOTIFY_REFRESH_TOKEN
  ) {
    throw new Error(
      'process.env.SPOTIFY_CLIENT_ID & process.env.SPOTIFY_CLIENT_SECRET & process.env.SPOTIFY_REFRESH_TOKEN must be defined with your Spotify Client Credentials',
    );
  }

  return {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
  };
};

const refreshTokenIfExpired = async (): Promise<{
  access_token: string;
  expires_at: string;
}> => {
  if (
    !authorization.access_token ||
    authorization.expires_at < new Date().toISOString()
  ) {
    const authorizationResponse = await new Spotify(getSpotifyCredentials())
      .refreshAccessToken()
      .catch((err) => {
        throw new Error(
          'Unable to authenticate with Spotify API, please try again later! Error: ' +
            err.message,
        );
      });

    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + (authorizationResponse.body.expires_in - 300),
    );
    authorization = {
      access_token: authorizationResponse.body.access_token,
      expires_at: expiresAt.toISOString(),
    };
  }

  return authorization;
};

export const getSpotifyClient = async () => {
  await refreshTokenIfExpired();

  return new Spotify({
    ...getSpotifyCredentials(),
    accessToken: authorization.access_token,
  });
};
