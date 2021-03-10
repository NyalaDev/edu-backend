const { slugify } = require('../../api/helpers/util');
const languageSeeder = async () => {
  const count = await strapi.query('language').count({});
  if (count === 0) {
    const seed = require('../../data/seed/languages.json');
    seed.forEach((language) => {
      strapi.services.language.create({
        name: language.name,
        iso2: language.iso2,
      });
    });
  }
};

const tagSeeder = async () => {
  if (process.env.NODE_ENV === 'production') return;

  const count = await strapi.query('tag').count({});
  if (count === 0) {
    const tags = require('../../data/seed/tags.json');
    for (const tag of tags) {
      await strapi.services.tag.create(tag);
    }
  }
};

const courseSeeder = async () => {
  if (process.env.NODE_ENV === 'production') return;

  const count = await strapi.query('course').count({});
  if (count === 0) {
    const courses = require('../../data/seed/abolkog_prod_courses.json');
    const lectures = require('../../data/seed/abolkog_prod_lectures.json');

    for (const rawCourse of courses) {
      rawCourse.language = 6;
      rawCourse.instructor = 1;
      rawCourse.tags = [1];
      rawCourse.level = 'intermediate';
      let createdCourse = await strapi.services.course.create(rawCourse);
      const courseLectures = lectures.filter((l) => l.course_id === rawCourse.id);
      for (const lecture of courseLectures) {
        delete lecture.course_id;
        lecture.course = createdCourse.id;
        await strapi.services.lecture.create(lecture);
      }
    }
  }
};

const createRoleIfNotExists = async (name, type) => {
  const roleEntity = await strapi.query('role', 'users-permissions').findOne({ type });
  if (!roleEntity) {
    await strapi.query('role', 'users-permissions').create({ name, type });
    strapi.log.debug(`created role ${name}`);
  }
};

const roleSeeder = async () => {
  await createRoleIfNotExists('Teacher', 'teacher');

  const profiles = await strapi.query('profile').find();
  const users = await strapi.query('user', 'users-permissions').find();

  if (profiles && profiles.length === 0 && users && users.length === 0) {
    const { id: profileId } = await strapi
      .query('profile')
      .create({
        name: 'test',
        bio: 'test bio',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com/test',
      });
    await strapi
      .query('user', 'users-permissions')
      .create({ username: 'test', email: 'test@test.com', profile: profileId });
    strapi.log.debug('created first user in DB');
  }
};

module.exports = { languageSeeder, courseSeeder, roleSeeder, tagSeeder };
