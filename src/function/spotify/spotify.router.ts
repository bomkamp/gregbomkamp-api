import { Router } from 'express';
import { callback, login } from './spotify-authorization.service';
import { getRecentlyPlayedTracks } from './spotify.service';

export const SpotifyRouter = ((): Router => {
  let router = Router();

  router.get('/api/v1/spotify/tracks/recent', async (req, res) => {
    let limit;

    if (req.query.limit) {
      try {
        limit = Number.parseInt(`${req.query.limit}`);
        if (limit < 1) {
          throw new Error('Invalid limit, must be positive integer.');
        }
      } catch (err) {
        res.status(400).json({
          error: `Unable to use limit value [${req.query.limit}]. Please ensure that limit is set to a positive integer. Example: ?limit=25`,
        });
      }
    }
    try {
      res.status(200).json(
        await getRecentlyPlayedTracks({
          limit,
        }),
      );
    } catch (err) {
      res.status(500).json({
        error:
          'There was an error getting the recent tracks. Error: ' + err.message,
      });
    }
  });

  router.get('/spotify/login', (req, res) => {
    login(req, res);
  });

  router.get('/spotify/callback', async (req, res) => {
    if (req.query.code) {
      try {
        res.json(
          await callback(
            `${req.query.code}`,
            `${req.protocol + '://' + req.hostname}/spotify/callback`,
          ),
        );
      } catch (err) {
        res.status(500).json({
          error:
            'There was an error getting the access/refresh token. Error: ' +
            err.message,
        });
      }
    } else {
      res.status(500).json({
        error: 'There was an error getting the access/refresh token.',
      });
    }
  });

  return router;
})();
