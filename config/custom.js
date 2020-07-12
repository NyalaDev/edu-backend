/**
 * Custom configuration
 * TODO: Replace Youtube SSM with this
 */
module.exports = ({ env }) => {
  return {
    algolia: {
      appId: env('ALGOLIA_APP_ID'),
      apiKey: env('ALGOLIA_SECRET'),
    },
  };
};
