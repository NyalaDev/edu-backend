'use strict';
const { sanitizeEntity } = require('strapi-utils');

const {
  isValidYoutubeUrl,
  getVideoId,
  getVideoDuration,
  getPlaylistContents,
  getPlayListId,
} = require('../../helpers/youtube');

module.exports = {
  async create(ctx) {
    const {
      state: { user },
      request: { body },
    } = ctx;

    const course = await strapi.services.course.findOne({
      id: body.course,
      'instructor.id': user.id,
    });

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
  async delete(ctx) {
    const { id } = ctx.params;
    const lecture = await strapi.services.lecture.findOne({ id });

    const course = await strapi.services.course.find({
      id: lecture.course.id,
      'instructor.id': ctx.state.user.id,
    });

    if (!course) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    const entity = await strapi.services.lecture.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.lecture });
  },
  async import(ctx) {
    const {
      state: { user },
      request: { body },
    } = ctx;

    const course = await strapi.services.course.findOne({
      id: body.course,
      'instructor.id': user.id,
    });

    if (!course) {
      return ctx.response.notFound('Invalid course');
    }

    const playListId = getPlayListId(body.url);
    if (!playListId) {
      return ctx.response.send(
        { error: 'Unable to get playlist id, make sure you are passing a valid youtube URL' },
        500
      );
    }

    const data = await getPlaylistContents(playListId);
    const asyncCreate = data.map(async (item) => {
      return await strapi.services.lecture.create({
        ...item,
        course: body.course,
      });
    });

    const lectures = await Promise.all(asyncCreate);

    return lectures.map((lecture) => sanitizeEntity(lecture, { model: strapi.models.lecture }));
  },
};
