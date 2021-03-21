# Barmaga.IO Backend API

This is [Barmaga.io](https://barmaga.io) website backend api, built with [Strapi](https://strapi.io).

If you are looking for the front-end, pelase visit this repo [edu-ui](https://github.com/NyalaDev/edu-ui)

## Requirements

- NodeJS
- PostgresSQL (Recommended to use docker)
- Youtube API Key
- Algolia Account (If you want to enable search and indexing)

## Starting the database setup

This project uses PostgreSQL database, the recommended way is to use docker to setup the database. There is a docker compose file included with the project for the database.

- Make sure you have Docker installed
- Run the command in the project root

```
docker-compose -f docker-compose-dev.yml up
```

## Getting Started

- install the dependencies

```
yarn
```

- Create `.env` file in root of the project

```
touch .env
```

- Add the following configuation

```
# for social login. Replace the port with your configured port number
APP_URL=http://localhost:1437

# ALGOLIA Configuration
ALGOLIA_APP_ID=ENTER_ALGOLIA_APP_ID_HERE
ALGOLIA_SECRET=ENTER_ALGOLIA_SECRET_HERE

# Youtube API
YOUTUBE_API_KEY=YOUTUBE_API_KEY_HERE
```

- Start the dev server

```

yarn develop

```
