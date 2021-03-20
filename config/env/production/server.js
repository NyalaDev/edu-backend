module.exports = ({ env }) => {
  return {
    url: env('APP_URL', 'https://edu-api-prod.herokuapp.com'),
  };
};
