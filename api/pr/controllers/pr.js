'use strict';

module.exports = {
  async create(ctx) {
    const {
      state: { user },
      request: { body },
    } = ctx;

    const pr = { ...body, user: user.id };

    const entity = await strapi.services.pr.create(pr);
    console.log(entity, 'entity');
    return entity;
  },
};
