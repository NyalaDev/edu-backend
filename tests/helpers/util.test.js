const util = require('../../api/helpers/util');

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
