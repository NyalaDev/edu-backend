module.exports = {
  /**
   * TODO: Create a pacakge called nyla-something ??? and move all common things like this there
   * Simple create slug from text using regex as slugify does not support arabic
   * @param {*} text Text to slugify
   * @param {*} delimiter The delimiter value to use, default is dash -
   */
  slugify(text, delimiter) {
    const delimiterToUse = delimiter || '-';
    return text.trim().toLowerCase().replace(/\s+/g, delimiterToUse);
  },
};
