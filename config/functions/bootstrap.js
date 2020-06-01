'use strict';
const AWS = require('aws-sdk');
const { languageSeeder, courseSeeder } = require('./seeder');
const Settings = require('../../api/helpers/settings');

const region = process.env.AWS_REGION || 'eu-central-1';
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
      Name: '/Orula/dev/YoutubeApiKey',
      WithDecryption: true,
    };
    const { Parameter } = await ssm.getParameter(options).promise();
    const settings = new Settings();
    settings.set('youtubeApiKey', Parameter.Value);
  } catch (e) {
    console.log('Error');
  }

  // Seed the languages tables if no language exists
  languageSeeder();

  // Seed the courses and lectures table
  courseSeeder();
};
