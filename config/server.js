module.exports = ({ env }) => {
  return {
    host: env('HOST', 'localhost'),
    port: env.int('PORT', 1437),
    url: `http:${env('HOST', 'localhost')}:${env.int('PORT', 1437)}`,
    cron: {
      enabled: false,
    },
    admin: {
      autoOpen: false,
    },
  };
};
