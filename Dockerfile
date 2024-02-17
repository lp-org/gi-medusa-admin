
FROM node:18.19.0-alpine
RUN mkdir -p /app
WORKDIR /app
COPY ./package.json /app/
RUN npm install && npm cache clean --force

ARG MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}

FROM socialengine/nginx-spa:latest
RUN npm run build
COPY ./dist /app
RUN chmod -R 777 /app
