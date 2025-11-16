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

COPY frontend-app/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN npm install -g pm2 serve

RUN apk add --no-cache supervisor

RUN addgroup -S appuser && \
    adduser -D -S -G appuser appuser

RUN chown -R appuser:appuser /app

RUN mkdir -p /app/supervisor /app/dist && chown -R appuser:appuser /app/supervisor /app/dist /app

USER appuser

EXPOSE 3000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]