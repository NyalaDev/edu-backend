'use strict';
const { languageSeeder, courseSeeder } = require('./seeder');
const { initPermissions } = require('./permissions.helper');

module.exports = async () => {
  languageSeeder();
  courseSeeder();
  initPermissions();
};
