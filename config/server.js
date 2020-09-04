module.exports = ({ env }) => {
  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1437),
    cron: {
      enabled: false,
    },
    admin: {
      autoOpen: false,
    },
    url: env('APP_URL', 'https://edu-api-prod.herokuapp.com'),
  };
};
