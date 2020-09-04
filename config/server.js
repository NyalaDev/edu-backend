module.exports = ({ env }) => {
  const isDev = env('NODE_ENV') === 'development';

  const host = env('HOST', '0.0.0.0');
  const port = env.int('PORT', 1437);

  const APP_URL = env('APP_URL', 'https://edu-api.nyaladev.com');
  const url = isDev ? `http:${host}:${port}` : APP_URL;

  return {
    host,
    port,
    cron: {
      enabled: false,
    },
    admin: {
      autoOpen: false,
    },
    // url,
  };
};
