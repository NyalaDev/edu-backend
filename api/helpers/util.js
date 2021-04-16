module.exports = {
  /**
   * TODO: Create a pacakge called nyla-something ??? and move all common things like this there
   * Simple create slug from text using regex as slugify does not support arabic
   * @param {*} text Text to slugify
   * @param {*} delimiter The delimiter value to use, default is dash -
   */
  slugify(text, delimiter = '-') {
    return text.trim().toLowerCase().replace(/\s+/g, delimiter);
  },
  /**
   * Generate random alpha-numeric N characters string
   * @param {number} length String length. Default is 9
   * @returns {string} generated value
   */
  randomString(length = 9) {
    const SEED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i += 1) {
      result += SEED.charAt(Math.floor(Math.random() * SEED.length));
    }
    return result;
  },
};
