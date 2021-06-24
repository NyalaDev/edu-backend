const axios = require('axios');

const VALIDATE_YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
const EXTRACT_YOUTUBE_REGEX =
  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

/**
 * Check if a URL is a valid Youtube URL using RegEx
 * @param {string} url The URL to check
 */
const isValidYoutubeUrl = (url) => {
  return VALIDATE_YOUTUBE_REGEX.test(url);
};

/**
 * Extract Youtube Video ID from a Youtube URL
 * @param {string} url Youtube URL
 */
const getVideoId = (url) => {
  const match = url.match(EXTRACT_YOUTUBE_REGEX);
  if (match && match[7].length == 11) {
    return match[7];
  }
  return null;
};

/**
 * Get Youtube video duration
 * @param {string} videoId Youtube Video ID
 */
const getSingleVideo = async (videoId) => {
  try {
    if (!videoId) throw new Error('Video Id is not defined');
    const key = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${key}`;
    const { data } = await axios.get(url);
    const { items } = data;
    const {
      contentDetails: { duration },
    } = items[0];

    return { duration };
  } catch (e) {
    return null;
  }
};

/**
 * Get Youtube PlayList ID from the URL
 * @param {string} url youtube url
 */
const getPlayListId = (url) => {
  if (!url) return null;
  const REGEX = /[&?]list=([^&]+)/;
  const match = url.match(REGEX);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

/**
 * Get Youtube Playlist contents
 * @param {string} playListId
 */
const getPlaylistContents = async (playListId) => {
  try {
    if (!playListId) throw new Error(`Playlist Id is not defined: ${playListId}`);
    const key = process.env.YOUTUBE_API_KEY;
    // TODO: Future improvements: Use pagination instead of max result?
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playListId}&part=snippet&key=${key}&maxResults=50`;
    const { data } = await axios.get(url);
    const { items } = data;

    const asyncResult = items.map(async (item) => {
      const { snippet } = item;
      const { title, position, resourceId } = snippet;
      if (!resourceId || resourceId.kind !== 'youtube#video' || !resourceId.videoId) {
        throw new Error('Unable to get video id');
      }
      const { duration } = await getSingleVideo(resourceId.videoId);

      if (!duration) throw new Error(`Unable to get duration for video ${videoId}`);

      return {
        title,
        position,
        url: `https://www.youtube.com/watch?v=${resourceId.videoId}`,
        duration,
      };
    });

    return await Promise.all(asyncResult);
  } catch (e) {
    strapi.log.error(e);
    return null;
  }
};

module.exports = {
  isValidYoutubeUrl,
  getVideoId,
  getSingleVideo,
  getPlayListId,
  getPlaylistContents,
};
