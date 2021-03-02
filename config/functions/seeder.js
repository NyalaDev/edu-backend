const { slugify } = require('../../api/helpers/util');
const languageSeeder = async () => {
  try {
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
  } catch (e) {
    console.error(e);
  }
};

const courseSeeder = async () => {
  if (process.env.NODE_ENV === 'production') return;
  try {
    const count = await strapi.query('course').count({});
    if (count === 0) {
      const courses = require('../../data/seed/abolkog_prod_courses.json');
      const lectures = require('../../data/seed/abolkog_prod_lectures.json');

      for (const rawCourse of courses) {
        rawCourse.language = 6;
        rawCourse.instructor = 1;
        let createdCourse = await strapi.services.course.create(rawCourse);
        const courseLectures = lectures.filter((l) => l.course_id === rawCourse.id);
        for (const lecture of courseLectures) {
          delete lecture.course_id;
          lecture.course = createdCourse.id;
          await strapi.services.lecture.create(lecture);
        }
      }
    }
  } catch (e) {
    strapi.log.error(e);
  }
};

const createRoleIfNotExists = async (name, type) => {
  const roleEntity = await strapi.query('role', 'users-permissions').findOne({ type });
  if(!roleEntity) {
    await strapi.query('role', 'users-permissions').create({ name, type });
    strapi.log.debug(`created role ${name}`);
  }
}

const roleSeeder = async () => {
  try {
    await createRoleIfNotExists('Teacher', 'teacher');

    const users = await strapi.query('user', 'users-permissions').find();
    if(users && users.length === 0) {
      await strapi.query('user', 'users-permissions').create({ username: 'test', email: 'test@test.com' });
      strapi.log.debug('created first user in DB');
    }

  } catch (e) {
    console.error(e);
  }
}

module.exports = { languageSeeder, courseSeeder, roleSeeder };
