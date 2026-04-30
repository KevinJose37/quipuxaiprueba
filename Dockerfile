# -- Build stage --
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Variable de entorno para la URL de la API en build time
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Generar index.html para servir como SPA
# TanStack Start con Cloudflare adapter no genera index.html estático,
# así que lo creamos a partir de los assets compilados.
RUN set -e; \
    CSS_FILE=$(cd dist/client/assets && ls *.css | head -1); \
    JS_ENTRIES=""; \
    for f in $(cd dist/client/assets && ls index-*.js); do \
      JS_ENTRIES="$JS_ENTRIES    <script type=\"module\" src=\"/assets/$f\"></script>\n"; \
    done; \
    printf '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>Quipux Flow Insights</title>\n    <meta name="description" content="Dashboard de facturación electrónica inteligente">\n    <link rel="stylesheet" href="/assets/%s">\n</head>\n<body>\n    <div id="root"></div>\n%b</body>\n</html>' "$CSS_FILE" "$JS_ENTRIES" > dist/client/index.html

# -- Production stage --
FROM nginx:alpine

# Copiar solo los assets del client (no el server de Cloudflare Workers)
COPY --from=builder /app/dist/client /usr/share/nginx/html

# Configuración de nginx para SPA + proxy API
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
