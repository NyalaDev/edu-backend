module.exports = ({ env }) => {
  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    cron: {
      enabled: false,
    },
    admin: {
      autoOpen: false,
    },
  };
};
