'use strict';
const { languageSeeder, courseSeeder } = require('./seeder');

module.exports = async () => {
  // Seed the languages tables if no language exists
  languageSeeder();

  // Seed the courses and lectures table
  courseSeeder();

  // User seeder ?
  // try {
  //   const users = await strapi.plugins['users-permissions'].services.user.fetchAll();
  //   console.log(users);
  // } catch (e) {
  //   console.error('Failed badly');
  // }
};
