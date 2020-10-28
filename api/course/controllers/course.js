const { sanitizeEntity } = require('strapi-utils');
const { slugify } = require('../../helpers/util');

const isTeacher = (user) => {
  try {
    const { role } = user;
    return role.type === 'teacher';
  } catch (e) {
    return false;
  }
};

module.exports = {
  async find(ctx) {
    const courses = await strapi
      .query('course')
      .find({ status: 'Published', ...ctx.query }, [
        'language',
        'lectures',
        'tags',
        'instructor',
        'instructor.profile',
      ]);

    return courses.map((course) => sanitizeEntity(course, { model: strapi.models.course }));
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const course = await strapi
      .query('course')
      .findOne({ id }, ['lectures', 'tags', 'instructor', 'instructor.profile']);

    return sanitizeEntity(course, { model: strapi.models.course });
  },
  async findForTeacher(ctx) {
    const {
      state: { user },
    } = ctx;
    const courses = await strapi.services.course.find({ instructor: user.id, ...ctx.query });
    return courses.map((course) => sanitizeEntity(course, { model: strapi.models.course }));
  },
  async findOneForTeacher(ctx) {
    const {
      params: { slug },
      state: { user },
    } = ctx;

    const course = await strapi.services.course.findOne({ slug, instructor: user.id });
    return sanitizeEntity(course, { model: strapi.models.course });
  },
  async create(ctx) {
    const {
      state: { user },
      request: { body },
    } = ctx;

    if (!isTeacher(user)) {
      return ctx.unauthorized(`Action is not allowed`);
    }

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

    const course = await strapi.services.course.findOne({
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
    const course = await strapi.services.course.findOne({
      id: ctx.params.id,
      'instructor.id': ctx.state.user.id,
    });

    if (!course) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    const entity = await strapi.services.course.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.course });
  },
  async patchCourse(ctx) {
    const { id } = ctx.params;
    const {
      state: { user },
      request: { body },
    } = ctx;
    const { status = 'Draft' } = body;

    const course = await strapi.services.course.findOne({
      id,
      'instructor.id': user.id,
    });

    if (!course) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (course.lectures.length === 0 && status === 'Published') {
      return ctx.unauthorized(`You cannot publish a course with no lectures`);
    }

    const patch = {};
    if (body.status) {
      patch.status = status;
    }

    if (body.tags) {
      console.log('wala');
      patch.tags = body.tags;
    }

    const sanatizedStatus = status.toLowerCase() === 'published' ? 'Published' : 'Draft';

    const entity = await strapi.services.course.update({ id }, { status: sanatizedStatus });

    return sanitizeEntity(entity, { model: strapi.models.course });
  },
};
