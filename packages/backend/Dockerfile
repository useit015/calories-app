FROM node:latest AS builder

ENV NODE_ENV build

WORKDIR /home/node
COPY . /home/node

RUN yarn install --frozen-lockfile --silent \
	&& yarn workspace toptal-calories-api build

# ---

FROM node:latest

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --chown=node:node --from=builder /home/node/packages/backend/package.json /home/node/
COPY --chown=node:node --from=builder /home/node/yarn.lock /home/node/
COPY --chown=node:node --from=builder /home/node/packages/backend/dist/ /home/node/dist/

RUN yarn install --frozen-lockfile --silent

EXPOSE 3333

CMD ["yarn", "start:prod"]