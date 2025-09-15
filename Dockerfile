# Stage build
FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend-app/package*.json ./

RUN npm ci

COPY frontend-app/ ./

RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/build /app/build

RUN npm install -g pm2 serve

RUN addgroup -S appuser && \
    adduser -D -S -G appuser appuser

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

CMD ["pm2-runtime", "start", "npx", "--", "serve", "-s", "build", "-l", "3000"]