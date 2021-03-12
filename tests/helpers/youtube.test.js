const mockAxios = require('axios');
const youtubeUtil = require('../../api/helpers/youtube');
const mockedYoutubeAPIResponse = require('../mocks/youtube-get-video-response.json');
const mockedYoutubePlaylistAPIResponse = require('../mocks/youtube-get-playlist-response.json');

const YoutubeVideoId = 'ncPq_wHzXu0';
const YouTubeVideoURL = `https://www.youtube.com/watch?v=${YoutubeVideoId}`;

const YoutubePlayListId = 'PLkLgubAD8tX60yyV2pMurBCu-b0UHYYl-';
const YouTubePlayListURL = `https://www.youtube.com/watch?v=J3UynuivVy4&list=${YoutubePlayListId}&ab_channel=Barmaga`;
const YouTubePlayListURL2 = `https://www.youtube.com/playlist?list=${YoutubePlayListId}`;

describe('Youtube Util test', () => {
  describe('isValidYoutubeUrl tests', () => {
    it('should return false if invalid youtube url provided', () => {
      expect(youtubeUtil.isValidYoutubeUrl('https://nyala.dev')).toBeFalsy();
    });
    it('should return true if a valid youtube url provided', () => {
      expect(youtubeUtil.isValidYoutubeUrl(YouTubeVideoURL)).toBeTruthy();
    });
  });

  describe('getVideoId tests', () => {
    it('should extract youtube video id from a valid youtube url', () => {
      const id = youtubeUtil.getVideoId(YouTubeVideoURL);
      expect(id).toBeDefined();
      expect(id).toBe(YoutubeVideoId);
    });
    it('should return null if youtube url is not valid when getting video id', () => {
      expect(youtubeUtil.getVideoId('https://nyala.dev')).toBe(null);
    });
  });

  describe('getVideoDuration tests', () => {
    beforeAll(() => {
      mockAxios.get = jest.fn((url) => {
        if (!url) return Promise.reject(null);
        return Promise.resolve({ data: mockedYoutubeAPIResponse });
      });
    });

    it('should return null if error occured in getting duration', async () => {
      const resutlt = await youtubeUtil.getVideoDuration();
      expect(resutlt).toBe(null);
    });

    it('should return duration', async () => {
      const resutlt = await youtubeUtil.getVideoDuration(YouTubeVideoURL);
      expect(resutlt).toBe('PT23M22S');
    });
  });

  describe('getPlayListId tests', () => {
    it('should extract youtube playlist id from a youtube watch url with list id', () => {
      const id = youtubeUtil.getPlayListId(YouTubePlayListURL);
      expect(id).toBeDefined();
      expect(id).toBe(YoutubePlayListId);
    });
    it('should extract youtube playlist id from a youtube list url', () => {
      const id = youtubeUtil.getPlayListId(YouTubePlayListURL2);
      expect(id).toBeDefined();
      expect(id).toBe(YoutubePlayListId);
    });
    it('should return null if youtube url is not valid when getting playlist id', () => {
      expect(youtubeUtil.getPlayListId('https://nyala.dev')).toBe(null);
    });
  });

  describe('getPlaylistContents test', () => {
    beforeAll(() => {
      mockAxios.get = jest.fn((url) => {
        if (!url) return Promise.reject(null);
        const resolvedData = url.includes('playlistItems')
          ? mockedYoutubePlaylistAPIResponse
          : mockedYoutubeAPIResponse;
        return Promise.resolve({ data: resolvedData });
      });
    });
    it('should return null if error occured in getting contents', async () => {
      const resutlt = await youtubeUtil.getPlaylistContents();
      expect(resutlt).toBe(null);
    });

    it('should return array of videos', async () => {
      const resutlt = await youtubeUtil.getPlaylistContents('PLkLgubAD8tX60yyV2pMurBCu-b0UHYYl-');

      expect(resutlt).toBeDefined();
      expect(resutlt.length).toBe(10);

      const firstItem = resutlt[0];
      expect(firstItem).toHaveProperty('title');
      expect(firstItem).toHaveProperty('position');
      expect(firstItem).toHaveProperty('url');
      expect(firstItem.url).toBe(`https://www.youtube.com/watch?v=J3UynuivVy4`);

      expect(resutlt[9].title).toBe('Arabic / React with TypeScript / 10  Conditional Rendering');
      expect(resutlt[9].position).toBe(9);
    });
  });
});
