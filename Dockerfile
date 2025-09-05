FROM node:22.19-alpine as development
RUN apk add --no-cache musl-dev
WORKDIR /var/www/app
COPY package*.json ./
RUN npm install -g @nestjs/cli
RUN npm install ci
COPY . ./


FROM node:22.19-alpine as build
ENV NODE_ENV production
WORKDIR /var/www/app
COPY package.json ./
COPY package-lock.json ./
COPY --from=development /var/www/app/node_modules ./node_modules
COPY . ./
RUN npm run build
RUN npm pkg delete scripts.postinstall && npm ci --omit=dev --ignore-scripts && npm cache clean --force


FROM node:22.19-alpine as production
ENV NODE_ENV production
WORKDIR /var/www/app
COPY --from=build /var/www/app/node_modules ./node_modules
COPY --from=build /var/www/app/dist ./dist
COPY --from=build /var/www/app/start.sh ./
COPY --from=build /var/www/app/package.json ./
CMD [ "./start.sh" ]
