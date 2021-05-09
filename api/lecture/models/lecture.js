const isProd = process.env.ALGOLIA_MODE === 'prod';
const algoliaIndexName = isProd ? 'lecture' : 'dev_lecture';
const { slugify, randomString } = require('../../helpers/util');

/**
 * Lifecycle callbacks for the `lecture` model.
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      const slug = slugify(data.title) || randomString();
      data.slug = slug;
    },
    async afterCreate(lecture) {
      // Save to index
      try {
        await strapi.services.search.save(lecture, algoliaIndexName);
      } catch (e) {
        strapi.log.error(`Error saving data to algolia: ${e.message}`);
      }
    },
    async afterUpdate(lecture) {
      // Save to index
      try {
        await strapi.services.search.save(lecture, algoliaIndexName);
      } catch (e) {
        strapi.log.error(`Error saving data to algolia: ${e.message}`);
      }
    },
    async afterDelete(lecture) {
      try {
        await strapi.services.search.delete(lecture.id, algoliaIndexName);
      } catch (e) {
        strapi.log.error(`Error deleting data to algolia: ${e.message}`);
      }
    },
  },
};
