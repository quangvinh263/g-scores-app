FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY src ./src
COPY data ./data

EXPOSE 3000

CMD ["sh", "-c", "npm run migration:run && npm run seed && npm run start:prod"]
