FROM node:12

WORKDIR /app

COPY / /app

ENV NODE_ENV=production

RUN yarn --production
RUN yarn build


CMD ["yarn", "start"]

EXPOSE 1437
