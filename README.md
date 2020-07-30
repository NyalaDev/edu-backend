# Nyala Edu backend (Orula)

Edu and Training website back-end. Built with Strapi

## Requirements

- NodeJS
- PostgresSQL (Recommended to use docker)
- Algolia Account
- Youtube API Key

## Starting the database setup

This project uses PostgreSQL database, recommended way is to use docker to setup the database.

> If you are not using docker, then figure out how to create the database yourself

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
