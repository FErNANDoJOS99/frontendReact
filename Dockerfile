FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend-app/package*.json ./
RUN npm ci

COPY frontend-app/ ./
RUN npm run build

# ------------------------------
# Stage 2: Runtime
# ------------------------------
FROM node:18-alpine AS runtime

WORKDIR /app

# Copiar build estático
COPY --from=builder /app/build ./build

# Copiar script
COPY inject-config.sh /app/inject-config.sh
RUN chmod +x /app/inject-config.sh

# Crear usuario no-root
RUN addgroup -S appuser && adduser -S -G appuser appuser

# Dar permisos reales al usuario
RUN chown -R appuser:appuser /app/build

RUN npm install -g serve

USER appuser

EXPOSE 3000

ENV REACT_APP_API_BASE_URL="http://localhost:8000/api"

CMD ["/bin/sh", "-c", "/app/inject-config.sh && serve -s build -l 3000"]
