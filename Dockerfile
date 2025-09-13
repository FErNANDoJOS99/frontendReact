# React Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pm2 globally
RUN npm install -g pm2

# Copy package files
COPY frontend-app/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY frontend-app/ ./

# Build the React app
RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Create non-root user
RUN addgroup -S appuser && \
    adduser -D -S -G appuser appuser

# Change ownership to appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port 3000
EXPOSE 3000

# Use pm2 to serve the built React app
CMD ["pm2-runtime", "start", "npx", "--", "serve", "-s", "build", "-l", "3000"]