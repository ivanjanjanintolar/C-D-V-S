/* eslint-disable prettier/prettier */
module.exports = {
  apps: [
    {
      name: 'demo_app',
      script: './dist/main.js',
      env: {
        SERVER_PORT: '4000',
        PG_PORT : '5432',
        PG_HOST: 'localhost',
        PG_USERNAME: 'root',
        PG_PASSWORD: '123456',
        PG_DATABASE: 'cotrugli_db',
      },
    },
  ],
};
