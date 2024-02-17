
FROM node:18.19.0-alpine
RUN mkdir -p /app
WORKDIR /app
COPY . /app/
RUN npm install && npm cache clean --force

ARG MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}

RUN npm run build

FROM socialengine/nginx-spa:latest
COPY ./dist /app
RUN chmod -R 777 /app
