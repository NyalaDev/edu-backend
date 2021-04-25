'use strict';
const axios = require('axios');
const url = process.env.EMAIL_SUBSCRIBE_URL || `https://barmga-lambda.nyaladev.com/email-subscribe`;

const subscribeToMailingList = async (values) => {
  const { data } = await axios.post(url, values);
  return data;
};

module.exports = {
  lifecycles: {
    afterCreate: async (model, response, options) => {
      try {
        if (model.emailSubscription && model.language) {
          await subscribeToMailingList({
            email: model.email,
            LANGUAGE: model.language,
          });
        }
      } catch (error) {
        strapi.log.error(error);
      }
    },
  },
};
