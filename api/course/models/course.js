'use strict';
const { slugify } = require('../../helpers/util');

/**
 * Lifecycle callbacks for the `course` model.
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      const slug = slugify(data.title);
      data.slug = slug;
    },
  },
};
