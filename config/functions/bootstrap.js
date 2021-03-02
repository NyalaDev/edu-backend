'use strict';
const { languageSeeder, courseSeeder, roleSeeder } = require('./seeder');
const { initPermissions } = require('./permissions.helper');

module.exports = async () => {
  await roleSeeder();
  await languageSeeder();
  await courseSeeder();
  await initPermissions();
};
