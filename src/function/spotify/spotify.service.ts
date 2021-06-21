import { getSpotifyClient } from './spotify-authorization.service';

const DEFAULT_NUM_OF_RECENT_TRACKS = 30;

export interface getRecentlyPlayedTracksProps {
  /**
   * Limits the number of results. Must be between 1-50 inclusively
   *
   * @default 30
   */
  limit?: number;
}

const getRecentlyPlayedTrackData = async (
  props?: getRecentlyPlayedTracksProps,
) => {
  const spotifyApi = await getSpotifyClient();
  const tracksResponse = await spotifyApi
    .getMyRecentlyPlayedTracks({
      limit: props?.limit || DEFAULT_NUM_OF_RECENT_TRACKS,
    })
    .catch((err) => {
      throw new Error(
        'There was an error getting recently played tracks. Error: ' +
          err.message,
      );
    });

  return tracksResponse.body.items.map((track) => ({
    id: track.track.id,
    played_at: track.played_at,
  }));
};

/**
 *
 * @param props getRecentlyPlayedTracksProps
 * @returns
 */
export const getRecentlyPlayedTracks = async (
  props?: getRecentlyPlayedTracksProps,
): Promise<(SpotifyApi.TrackObjectFull & { played_at: string })[]> => {
  const tracks = await getRecentlyPlayedTrackData(props);
  const spotifyApi = await getSpotifyClient();
  const tracksResponse = await spotifyApi
    .getTracks(tracks.map((track) => track.id))
    .catch((err) => {
      throw new Error(
        'There was an error getting recently played tracks. Error: ' +
          err.message,
      );
    });

  return tracksResponse.body.tracks
    .map((track) => ({
      ...track,
      played_at:
        tracks.find((trackData) => track.id === trackData.id)?.played_at ||
        'Unknown',
    }))
    .sort((a, b) => (a.played_at >= b.played_at ? -1 : 1));
};
