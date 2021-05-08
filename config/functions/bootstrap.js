'use strict';
const { languageSeeder, clearDB, courseSeeder, roleSeeder, tagSeeder } = require('./seeder');
const { initPermissions } = require('./permissions.helper');

module.exports = async () => {
  if (process.env.NODE_ENV !== 'prod' && process.env.CLEAR_DB === 'true') {
    await startClearDB();
  }
  try {
    await roleSeeder();
    await tagSeeder();
    await languageSeeder();
    await courseSeeder();
    await initPermissions();
  } catch (err) {
    strapi.log.error(err);
  }
};

const startClearDB = async () => {
  strapi.log.info(`
      ⚠️ Going to clear Database
      ⚠️ If you do not want this behaviour, make sure to delete CLEAR_DB variable in .env file
    `);
  const waitBeforeStarting = () =>
    new Promise((resolve) => {
      setTimeout(async () => {
        await clearDB();
        resolve();
      }, 2000);
    });
  await waitBeforeStarting();
  strapi.log.info('⚠️ Cleared Database');
};
