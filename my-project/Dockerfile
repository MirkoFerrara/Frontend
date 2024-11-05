# Stage 1: Build
FROM node:20-alpine as builder

# Imposta la directory di lavoro
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice sorgente
COPY . .

# Build dell'applicazione in modalità produzione
RUN npm run build

# Stage 2: Setup Nginx
FROM nginx:alpine

# Rimuovi la configurazione default di nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia i file buildati
COPY --from=builder /app/dist/my-project/browser/ /usr/share/nginx/html/

# Copia la configurazione nginx personalizzata
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]