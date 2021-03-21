const parse = require('pg-connection-string').parse;
const config = parse(process.env.DATABASE_URL);

module.exports = ({ env }) => {
  return {
    defaultConnection: 'default',
    connections: {
      default: {
        connector: 'bookshelf',
        settings: {
          client: 'postgres',
          host: config.host,
          port: config.port,
          database: config.database,
          username: config.user,
          password: config.password,
          ssl: {
            rejectUnauthorized: false,
          },
        },
        options: {
          ssl: true,
          pool: {
            min: 0,
            max: env.int('DB_POOL_MAX', 20),
            createTimeoutMillis: 60000,
            acquireTimeoutMillis: 60000,
            idleTimeoutMillis: 60000,
            reapIntervalMillis: 10000,
            createRetryIntervalMillis: 100,
            propagateCreateError: false,
          },
        },
      },
    },
  };
};
