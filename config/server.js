module.exports = ({ env }) => {
  const isDev = env('NODE_ENV') === 'development';

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1437),
    proxy: {
      enabled: isDev ? false : true,
      host: env('PROXY_HOST', ''),
      ssl: isDev ? false : true,
    },
    cron: {
      enabled: false,
    },
    admin: {
      autoOpen: false,
    },
  };
};
