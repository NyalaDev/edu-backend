const axios = require('axios');

const VALIDATE_YOUTUBE_REGEX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
const EXTRACT_YOUTUBE_REGEX = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

module.exports = {
  /**
   * Check if a URL is a valid Youtube URL using RegEx
   * @param {*} url The URL to check
   */
  isValidYoutubeUrl(url) {
    return VALIDATE_YOUTUBE_REGEX.test(url);
  },
  /**
   * Extract Youtube Video ID from a Youtube URL
   * @param {*} url Youtube URL
   */
  getVideoId(url) {
    const match = url.match(EXTRACT_YOUTUBE_REGEX);
    if (match && match[7].length == 11) {
      return match[7];
    } else {
      return null;
    }
  },
  /**
   * Get Youtube video duration
   * @param {*} videoId Youtube Video ID
   */
  async getVideoDuration(videoId) {
    try {
      const key = process.env.YOUTUBE_API_KEY;

      const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${key}`;
      const { data } = await axios.get(url);
      const { items } = data;
      const {
        contentDetails: { duration },
      } = items[0];

      // FIXME: Improve this formatting function
      return duration.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '');
    } catch (e) {
      return null;
    }
  },
};
