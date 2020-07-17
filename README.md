# Nyala Edu backend (Orula)

Edu and Training website back-end. Built with Strapi

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
# ALGOLIA Configuration
ALGOLIA_APP_ID=ENTER_ALGOLIA_APP_ID_HERE
ALGOLIA_SECRET=ENTER_ALGOLIA_SECRET_HERE
```

- Start the dev server

```

yarn develop

```
