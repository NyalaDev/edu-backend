'use strict';
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async find(ctx) {
    const { user } = ctx.state;
    if (user) {
      if (user.profile) {
        const entity = await strapi.services.profile.findOne({ id: user.profile });
        return sanitizeEntity(entity, { model: strapi.models.profile });

      }
      else {
        return {}
      }
    }
    else {
      //return ctx.response.badRequest(`Course slug must be unique ${slug}`);
      return ctx.unauthorized(`You can't see me`);
    }
  },
  async update(ctx) {
    const user = ctx.state.user;
    const body = ctx.request.body;
    const profile = { ...body, user:user.id };
    let entity;
    if (user.profile) {
      entity = await strapi.services.profile.update({id:user.profile}, profile);
    }
    else {
      entity = await strapi.services.profile.create(profile);
    }
    return sanitizeEntity(entity, { model: strapi.models.profile });
  },
};
