const axios = require('axios');

const EXTRACT_VIMEO_REGEX =
  /(?:www\.|player\.)?vimeo.com\/(?:showcase\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;

const PrivateKey = process.env.VIMEO_PRIVATE_API_KEY;
const PublicKey = process.env.VIMEO_PUBLIC_API_KEY;

const getVideoId = (url) => {
  const match = url.match(EXTRACT_VIMEO_REGEX);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

const getSingleVideo = async (videoId) => {
  try {
    const url = `https://api.vimeo.com/videos/${videoId}`;
    const {
      data: { duration, link },
    } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${PrivateKey}`,
      },
    });
    return { duration: duration.toString() };
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getPlayListId = (url) => {
  const match = url.match(EXTRACT_VIMEO_REGEX);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

const getPlaylistContents = async (channelId) => {
  if (!channelId) throw new Error(`Playlist Id is not defined: ${channelId}`);
  // TODO: Future improvements: Use pagination instead of max result?
  const url = `https://api.vimeo.com/me/albums/${channelId}/videos`;
  const {
    data: { data },
  } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${PrivateKey}`,
    },
  });

  const videos = data.map((video, index) => {
    return {
      title: video.name,
      description: video.description,
      url: video.link,
      duration: video.duration.toString(),
      position: index,
    };
  });
  return videos;
};

module.exports = {
  getVideoId,
  getSingleVideo,
  getPlayListId,
  getPlaylistContents,
};
