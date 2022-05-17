/* eslint-disable prettier/prettier */
module.exports = {
  apps: [
    {
      name: 'demo_app',
      script: './dist/main.js',
      env: {
        SERVER_PORT: '3010',
        PG_PORT : '5432',
        PG_HOST: 'localhost',
        PG_USERNAME: 'cotrugli',
        PG_PASSWORD: '9Bdq51m?',
        PG_DATABASE: 'cotrugli_tech_demo',
      },
    },
  ],
};
