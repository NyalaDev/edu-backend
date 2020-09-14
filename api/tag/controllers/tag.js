'use strict';
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async find(ctx) {
    const tags = await strapi.query('tag').find(ctx.query, ['courses', 'courses.lectures']);

    return tags.map((tag) => sanitizeEntity(tag, { model: strapi.models.tag }));
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const tag = await strapi.query('tag').findOne({ id }, ['courses', 'courses.lectures']);

    return sanitizeEntity(tag, { model: strapi.models.tag });
  },
};
