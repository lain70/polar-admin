FROM node:22-alpine AS builder

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VUE_APP_SERVICE_KEY
ARG VUE_APP_API_BASE_URL=/api
ARG VUE_APP_CUSTOMER_BASE_URL
ARG VUE_APP_PUBLIC_PATH=/admin/
ENV VUE_APP_SERVICE_KEY=${VUE_APP_SERVICE_KEY}
ENV VUE_APP_API_BASE_URL=${VUE_APP_API_BASE_URL}
ENV VUE_APP_CUSTOMER_BASE_URL=${VUE_APP_CUSTOMER_BASE_URL}
ENV VUE_APP_PUBLIC_PATH=${VUE_APP_PUBLIC_PATH}

RUN npm run build:prd

FROM nginx:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /workspace/dist /usr/share/nginx/html

EXPOSE 80
