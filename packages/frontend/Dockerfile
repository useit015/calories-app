FROM node:latest AS builder

# set working directory
WORKDIR /home/app
ENV NODE_ENV=production

# Dependencies

COPY package.json /home/app/
COPY yarn.lock /home/app/
COPY lerna.json /home/app/

COPY packages/frontend/package.json /home/app/packages/frontend/

# Build
COPY . /home/app/

RUN yarn install --silent

RUN cd packages/frontend && yarn build

FROM nginx:1.17.6-alpine

COPY --from=builder /home/app/packages/frontend/build /var/www/frontend
COPY --from=builder /home/app/packages/frontend/.docker/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443
