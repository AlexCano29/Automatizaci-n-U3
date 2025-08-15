# Stage 1: Build Angular
FROM node:22.16.0-alpine AS angular-builder
WORKDIR /app

# 1. Copiar solo los archivos necesarios para npm ci
COPY package*.json .
RUN npm ci

# 2. Copiar el angular.json modificado primero (para caché)
COPY angular.json .

# 3. Copiar el resto de archivos
COPY . .

# 4. Build con configuración de producción
RUN npm run build -- --configuration=production --output-hashing=all

# Resto de tu Dockerfile...
# Stage 2: Prepare API
FROM node:22.16.0-alpine AS api-prepare
RUN npm install -g json-server
WORKDIR /app/api
COPY db.json .
RUN echo $'#!/bin/sh\n\
echo "🔄 Starting JSON Server on port 3000"\n\
json-server --watch /app/api/db.json --port 3000 --host 0.0.0.0' > api-start.sh && \
    chmod +x api-start.sh

# Stage 3: Runtime
FROM nginx:alpine

# Install Node.js for API
RUN apk add --no-cache nodejs npm && \
    npm install -g json-server

# Copy Angular build (basado en la estructura de dist mostrada)
COPY --from=angular-builder /app/dist /usr/share/nginx/html

# Copy API files
COPY --from=api-prepare /app/api /app/api
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Combined startup script
RUN echo $'#!/bin/sh\n\
echo "🚀 Starting services..."\n\
# Iniciar JSON Server primero
json-server --watch /app/api/db.json --port 3000 --host 0.0.0.0 &\n\
# Luego iniciar Nginx
nginx -g "daemon off;"' > /start.sh && \
    chmod +x /start.sh

EXPOSE 80 3000
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
CMD ["/start.sh"]