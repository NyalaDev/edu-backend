'use strict';
const { languageSeeder, courseSeeder, roleSeeder, tagSeeder } = require('./seeder');
const { initPermissions } = require('./permissions.helper');

module.exports = async () => {
  try {
    await roleSeeder();
    await tagSeeder();
    await languageSeeder();
    await courseSeeder();
    await initPermissions();
  } catch(err) {
    strapi.log.error(err);
  }
};
