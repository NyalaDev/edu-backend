'use strict';
const { slugify } = require('../../helpers/util');

const isProd = process.env.ALGOLIA_MODE === 'prod';
const algoliaIndexName = isProd ? 'lecture' : 'dev_lecture';

/**
 * Lifecycle callbacks for the `course` model.
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      const slug = slugify(data.title);
      data.slug = slug;
    },
    async afterCreate(result) {
      const course = { ...result };
      const { instructor } = course;
      delete instructor.password;
      delete course.students;
      // delete course.lectures;
      course.instructor = instructor;

      // Save to index
      try {
        await strapi.services.search.save(course, algoliaIndexName);
      } catch (e) {
        strapi.log.error(`Error saving data to algolia: ${e.message}`);
      }
    },
    async afterUpdate(result) {
      const course = { ...result };
      const { instructor } = course;
      delete instructor.password;
      delete course.students;
      // delete course.lectures;
      course.instructor = instructor;

      // Save to index
      try {
        await strapi.services.search.save(course, algoliaIndexName);
      } catch (e) {
        strapi.log.error(`Error saving data to algolia: ${e.message}`);
      }
    },
    async afterDelete(result) {
      try {
        await strapi.services.search.delete(result.id, algoliaIndexName);
      } catch (e) {
        strapi.log.error(`Error deleting data to algolia: ${e.message}`);
      }
    },
  },
};
