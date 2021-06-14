'use strict';
const { sanitizeEntity } = require('strapi-utils');

/* const {
  isValidYoutubeUrl,
  getVideoId,
  getVideoDuration,
  getPlaylistContents,
  getPlayListId,
} = require('../../helpers/youtube'); */

const { getId, getSingleVideo, getPlaylistContents } = require('../../helpers/vimeo');

module.exports = {
  async create(ctx) {
    const {
      state: { user },
      request: {
        body: { course: courseId, title, description, url },
      },
    } = ctx;

    const course = await strapi.services.course.findOne({
      id: courseId,
      'instructor.id': user.id,
    });

    if (!course) {
      return ctx.response.notFound('Invalid course');
    }

    const position = course.lectures.length;

    const videoId = getId(url);
    if (!videoId) {
      return ctx.response.badRequest("Couldn't extract video id");
    }

    const video = await getSingleVideo(videoId);

    if (!video) {
      return ctx.response.badRequest('Unable to get video');
    }

    const lecture = { ...video, position, title, description, course: courseId };

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
      request: {
        body: { course: courseId, url },
      },
    } = ctx;

    const course = await strapi.services.course.findOne({
      id: courseId,
      'instructor.id': user.id,
    });

    if (!course) {
      return ctx.response.notFound('Invalid course');
    }

    const channelId = getId(url);

    if (!channelId) {
      return ctx.response.send(
        { error: 'Unable to get playlist id, make sure you are passing a valid video URL' },
        500
      );
    }

    const videos = await getPlaylistContents(channelId);

    const asyncCreate = videos.map(async (video) => {
      return await strapi.services.lecture.create({
        ...video,
        course: courseId,
      });
    });

    const lectures = await Promise.all(asyncCreate);

    return lectures.map((lecture) => sanitizeEntity(lecture, { model: strapi.models.lecture }));
  },
  async bulkUpdate(ctx) {
    const {
      state: { user },
      request: { body },
    } = ctx;

    const entity = body.map(async (lecture) => {
      return await strapi.services.lecture.update({ id: lecture.id }, lecture);
    });

    return entity;
  },
};
