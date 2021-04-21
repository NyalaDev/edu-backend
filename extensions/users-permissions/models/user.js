'use strict';
const axios = require('axios');

const subscribeToMailingList = async (values) => {
  const { data } = await axios.post(`https://barmga-lambda.nyaladev.com/email-subscribe`, values);
  return data;
};

module.exports = {
  lifecycles: {
    afterCreate: async (model, response, options) => {
      if (model.emailConfirmation && model.language) {
        await subscribeToMailingList({
          email: model.email,
          LANGUAGE: model.language,
        }).catch((e) => {
          console.log(e);
        });
      }
    },
  },
};
