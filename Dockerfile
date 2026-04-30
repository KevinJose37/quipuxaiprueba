# -- Build stage --
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Variable de entorno para la URL de la API en build time
ARG VITE_API_URL=http://localhost:8888
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# -- Production stage --
FROM nginx:alpine

# Copiar los archivos estáticos generados por Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de nginx para SPA (redirige todo a index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
