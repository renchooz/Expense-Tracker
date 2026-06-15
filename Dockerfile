# Stage 1: Build React client
FROM node:20-alpine AS client-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Production API server
FROM node:20-alpine AS server

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/ ./

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]

# Stage 3: Nginx serving the client and proxying API requests
FROM nginx:1.27-alpine AS web

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=client-build /app/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
