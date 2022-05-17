/* eslint-disable prettier/prettier */
module.exports = {
  apps: [
    {
      name: 'demo_app',
      script: './dist/main.js',
      env: {
        SERVER_PORT: '3020',
        PG_PORT : '5432',
        PG_HOST: 'localhost',
        PG_USERNAME: 'cotrugli_app',
        PG_PASSWORD: '@z03A7rn',
        PG_DATABASE: 'cotrugli_tech_app',
      },
    },
  ],
};
