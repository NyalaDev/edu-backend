module.exports = ({ env }) => {
  return {
    defaultConnection: 'default',
    connections: {
      default: {
        connector: 'bookshelf',
        settings: {
          client: 'postgres',
          host: env('DATABASE_HOST', '127.0.0.1'),
          port: env.int('DATABASE_PORT', 5433),
          database: env('DATABASE_NAME', 'orula'),
          username: env('DATABASE_USERNAME', 'nyala'),
          password: env('DATABASE_PASSWORD', 'password'),
          schema: 'public',
        },
        options: {
          debug: env('debug'),
          autoMigration: env('DATABASE_AUTOMIGRATION') === 'true',
          pool: {
            min: 0,
            max: env.int('DB_POOL_MAX', 60),
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
