const util = require('../../api/helpers/util');

describe('Util tests', () => {
  describe('Test Slugify', () => {
    it('should return slugify version of a string', () => {
      const string = 'nyala dev';
      expect(util.slugify(string)).toBe('nyala-dev');
    });
    it('should return slugify version of an arabicstring', () => {
      const string = 'الاسطورة خالد';
      expect(util.slugify(string)).toBe('الاسطورة-خالد');
    });
  });

  describe('Random String Tests', () => {
    it('should return 9 charcters string when length is not specified', () => {
      const random = util.randomString();
      expect(random).toBeDefined();
      expect(random.length).toBe(9);
    });

    it('should return correct length string when length is specified', () => {
      const length = 12;
      const random = util.randomString(length);
      expect(random).toBeDefined();
      expect(random.length).toBe(length);
    });
  });
});
