'use strict';
const AWS = require('aws-sdk');
const Settings = require('../../api/helpers/settings');

// @Mozafar, set AWES_REGION env
const region = process.env.AWS_REGION || 'ap-southeast-2';
AWS.config.update({ region });
const ssm = new AWS.SSM();

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
  try {
    // Load param from AWS
    const options = {
      Name: '/Orula/YoutubeApiKey',
      WithDecryption: true,
    };
    const { Parameter } = await ssm.getParameter(options).promise();
    const settings = new Settings();
    settings.set('youtubeApiKey', Parameter.Value);
  } catch (e) {
    console.log('Error');
  }

  // Seed the languages tables if no language exists
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
