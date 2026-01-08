FROM node:16-alpine

WORKDIR /app

# Python ve build araçları sqlite3 rebuild için gerekli
RUN apk add --no-cache python3 make g++

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle ve sqlite3'ü container için rebuild et
RUN npm install --production --build-from-source

# Uygulama kodunu kopyala
COPY . .

# Port'u expose et
EXPOSE 3000

# Sağlık kontrolü
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Uygulamayı başlat
CMD ["npm", "start"]
