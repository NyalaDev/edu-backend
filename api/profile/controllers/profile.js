'use strict';
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async find(ctx) {
    const { user } = ctx.state;
    if (user) {
      if (user.profile) {
        const entity = await strapi.services.profile.findOne({ id: user.profile }, [
          'user',
          'user.role',
        ]);
        return sanitizeEntity(entity, { model: strapi.models.profile });
      } else {
        return {};
      }
    } else {
      //return ctx.response.badRequest(`Course slug must be unique ${slug}`);
      return ctx.unauthorized(`You can't see me`);
    }
  },
  async update(ctx) {
    const user = ctx.state.user;
    const body = ctx.request.body;
    let dataToSave;
    if (body.completedlectures) {
      const { course, lecture } = body.completedlectures;
      dataToSave = { completedlectures: { [course]: [lecture] } };

      if (user.profile) {
        const userProfile = await strapi.services.profile.findOne({ id: user.profile });
        if (userProfile.completedlectures) {
          const completedCourseLectures = userProfile.completedlectures[course];
          dataToSave = completedCourseLectures
            ? {
                completedlectures: {
                  ...userProfile.completedlectures,
                  [course]: [...completedCourseLectures, lecture],
                },
              }
            : {
                completedlectures: { ...userProfile.completedlectures, [course]: [lecture] },
              };
        }
      }
    } else {
      dataToSave = body;
    }

    const profile = { ...dataToSave, user: user.id };
    let entity;
    if (user.profile) {
      entity = await strapi.services.profile.update({ id: user.profile }, profile);
    } else {
      entity = await strapi.services.profile.create(profile);
    }
    return sanitizeEntity(entity, { model: strapi.models.profile });
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    if (user.profile === parseInt(id)) {
      if (user.role.name !== 'Teacher') {
        await strapi.plugins['users-permissions'].services.user.remove({ id: user.id });
        const entity = await strapi.services.profile.delete({ id });
        return sanitizeEntity(entity, { model: strapi.models.profile });
      }
      return ctx.unauthorized(`You can't delete a user with role teacher`);
    }
    return ctx.unauthorized(`You can't delete this entry`);
  },
};
