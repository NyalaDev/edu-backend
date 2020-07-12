'use strict';

const isProd = process.env.ALGOLIA_MODE === 'prod';
const algoliaIndexName = isProd ? 'lecture' : 'dev_lecture';

/**
 * Lifecycle callbacks for the `lecture` model.
 */

module.exports = {
  lifecycles: {
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
        await strapi.services.search.save(course, algoliaIndexName);
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
