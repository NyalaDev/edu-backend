const { sanitizeEntity } = require('strapi-utils');
const { slugify } = require('../../helpers/util');

module.exports = {
  async create(ctx) {
    const {
      state: { user },
      request: { body },
    } = ctx;
    const course = { ...body, instructor: user.id };
    let entity;

    const slug = slugify(course.title);
    entity = await strapi.services.course.findOne({ slug: slug });
    if (entity) {
      return ctx.response.badRequest(`Course slug must be unique ${slug}`);
    }

    entity = await strapi.services.course.create(course);
    return sanitizeEntity(entity, { model: strapi.models.course });
  },
  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [course] = await strapi.services.course.find({
      id: ctx.params.id,
      'instructor.id': ctx.state.user.id,
    });

    if (!course) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    entity = await strapi.services.course.update({ id }, ctx.request.body);

    return sanitizeEntity(entity, { model: strapi.models.course });
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const [course] = await strapi.services.course.find({
      id: ctx.params.id,
      'instructor.id': ctx.state.user.id,
    });

    if (!course) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    const entity = await strapi.services.course.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.course });
  },
};
