'use strict';

module.exports = {
  async create(ctx) {
    const {
      state: { user },
      request: { body },
    } = ctx;

    const { lectureId, courseId, ...rest } = body;
    let entity;

    const ratingData = await strapi.services.rating.findOne({ courseId: courseId });

    if (ratingData) {
      const { data: previousRatings } = ratingData;
      const data = [...previousRatings, { lectureId, user: user.id, ...rest }];
      const payload = { ...rest, data };
      entity = await strapi.services.rating.update({ courseId }, payload);
      return entity;
    }

    const toSaveData = { ...rest, courseId, data: [{ lectureId, user: user.id, ...rest }] };

    entity = await strapi.services.rating.create(toSaveData);
    return entity;
  },
};
