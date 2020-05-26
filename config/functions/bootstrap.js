"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/concepts/configurations.html#bootstrap
 */

module.exports = async () => {
  // Seed the languages tables if no language exists
  try {
    const count = await strapi.query("language").count({});
    if (count === 0) {
      const seed = require("../../data/seed/languages.json");
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
