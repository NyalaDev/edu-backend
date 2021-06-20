'use strict';
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async create(ctx) {
    const {
      state: { user },
      request: { body },
    } = ctx;

    const question = { ...body, user: user.id };
    const entity = await strapi.services.question.create(question);

    return sanitizeEntity(entity, { model: strapi.models.question });
  },
};
