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

const settingsSeeder = async () => {
  const seed = require('../../data/seed/settings.json');
  const { homeQuotes, homeSettings } = (await strapi.query('settings').findOne()) || {};
  if (homeQuotes && homeQuotes.length && homeSettings) return;
  await strapi.query('settings').create(seed);
};

const courseSeeder = async () => {
  if (process.env.NODE_ENV === 'production') return;

  const count = await strapi.query('course').count({});
  if (count === 0) {
    const courses = require('../../data/seed/abolkog_prod_courses.json');
    const lectures = require('../../data/seed/abolkog_prod_lectures.json');

    const instructorUser = await strapi
      .query('user', 'users-permissions')
      .findOne({ email: 'abolkog@nyala.dev' });

    const firstTag = await strapi.query('tag').findOne({});
    const arLanguage = await strapi.query('language').findOne({ iso2: 'ar' });

    for (const rawCourse of courses) {
      rawCourse.language = arLanguage.id;
      rawCourse.instructor = instructorUser.id;

      rawCourse.tags = [firstTag.id];
      rawCourse.level = 'Intermediate';
      let createdCourse = await strapi.services.course.create(rawCourse);
      const courseLectures = lectures.filter((l) => l.course_id === rawCourse.id);

      await strapi.services.rating.create({
        rating: 5,
        courseId: createdCourse.id,
        data: JSON.stringify([{ lectureId: 1, user: 1, text: '', rating: 5 }]),
      });

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

const clearDB = async () => {
  await strapi.query('profile').delete();
  await strapi.query('user', 'users-permissions').delete();
  await strapi.query('lecture').delete();
  await strapi.query('course').delete();
  await strapi.query('tag').delete();
  await strapi.query('pr').delete();
  await strapi.query('rating').delete();
  await strapi.query('language').delete();
  await strapi.query('settings').delete();
};

const roleSeeder = async () => {
  await createRoleIfNotExists('Teacher', 'teacher');

  const profiles = await strapi.query('profile').find();
  const users = await strapi.query('user', 'users-permissions').find();

  const teacherRole = await strapi.query('role', 'users-permissions').findOne({ type: 'teacher' });

  const email = 'abolkog@nyala.dev';
  if (profiles && profiles.length === 0 && users && users.length === 0) {
    const user = await strapi.query('user', 'users-permissions').create({
      username: 'abolkog-test',
      role: teacherRole.id,
      email,
    });

    // the profile is created automatically now in the afterCreate hook of user
    const profile = await strapi.query('profile').findOne({
      email,
    });

    await strapi.query('profile').update(
      { id: profile.id },
      {
        name: 'abolkog',
        bio: 'abolkog is the father of sami.',
        linkedin: 'abolkog-linkedin',
        github: 'abolkog',
      }
    );
    strapi.log.debug('created first user in DB');
  }
};

module.exports = { languageSeeder, courseSeeder, roleSeeder, tagSeeder, clearDB, settingsSeeder };
