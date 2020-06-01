'use strict';
const { sanitizeEntity } = require('strapi-utils');

const { isValidYoutubeUrl, getVideoId, getVideoDuration } = require('../../helpers/youtube');

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const {
      state: { user },
      request: { body },
    } = ctx;

    const course = await strapi.services.course.findOne({ id: body.course });
    if (!course) {
      return ctx.response.notFound('Invalid course');
    }

    const position = course.lectures.length;

    if (!isValidYoutubeUrl(body.url)) {
      return ctx.response.badRequest('Invalid youtube URL');
    }

    const videoId = getVideoId(body.url);
    const duration = await getVideoDuration(videoId);
    if (!duration) {
      return ctx.response.badRequest('Unable to get duration');
    }

    const lecture = { ...body, duration, position };

    const entity = await strapi.services.lecture.create(lecture);
    return sanitizeEntity(entity, { model: strapi.models.lecture });
  },
};
