FROM node:18-alpine as base

WORKDIR /src
COPY package*.json /
EXPOSE 3000



FROM base as dev
ENV NODE_ENV=development

RUN npm ci
COPY --chown=node:node . ./
USER node
CMD ["npm", "start"]
