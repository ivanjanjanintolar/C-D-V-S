## Installation

1)- Once inside Backend directory run `npm install` to install the dependencies

2)- Run `docker-compose up` to start PostgreSQL Docker image.

3)- Run `Pm2 startOrRestart ./ecosystem.config.js` to generate all the tables and columns and make sure that connection to Postgres is correct.

## Running the app

```bash
# development
$ npm run start

Starts the app.\

# watch mode
$ npm run start:dev

Starts the app in watch mode.\

# npm run build

Builds the app for production to the `build` folder.\