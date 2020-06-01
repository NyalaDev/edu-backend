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
        rawCourse.instructor = 1; // FIXME: @mozafar, make sure to create an admin with id 1 till we fix this code to load user
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
    console.error(e);
  }
};

module.exports = { languageSeeder, courseSeeder };
