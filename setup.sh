#!/bin/bash

# Restoran Takip Sistemi - Otomatik Kurulum Scripti
# Platform: Linux/Mac

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║   Restoran Takip Sistemi - Otomatik Kurulum         ║"
echo "╚════════════════════════════════════════════════════════╝"

# Renkleri tanımla
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Gereksinimler kontrolü
echo -e "\n${YELLOW}📋 Sistem Gereksinimleri Kontrol Ediliyor...${NC}"

# Node.js kontrolü
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"
else
    echo -e "${RED}✗ Node.js bulunamadı. Lütfen Node.js 16+ kurun${NC}"
    exit 1
fi

# npm kontrolü
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm ${NPM_VERSION}${NC}"
else
    echo -e "${RED}✗ npm bulunamadı${NC}"
    exit 1
fi

# Git kontrolü
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓ $GIT_VERSION${NC}"
else
    echo -e "${RED}✗ Git bulunamadı. Lütfen Git kurun${NC}"
    exit 1
fi

# Docker kontrolü (opsiyonel)
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ $DOCKER_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Docker bulunamadı (opsiyonel)${NC}"
fi

# Bağımlılıkları yükle
echo -e "\n${YELLOW}📦 Bağımlılıklar Yükleniyor...${NC}"
npm install

# Veritabanını başlat
echo -e "\n${YELLOW}🗄️  Veritabanı Başlatılıyor...${NC}"
npm start &
sleep 5
kill %1 2>/dev/null || true

# Testleri çalıştır
echo -e "\n${YELLOW}🧪 Testler Çalıştırılıyor...${NC}"
npm run test:unit -- --passWithNoTests || true

echo -e "\n${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✓ Kurulum Tamamlandı!                              ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${YELLOW}Sonraki Adımlar:${NC}"
echo "1. Sunucuyu başlat: npm start"
echo "2. Health check: curl http://localhost:3000/health"
echo "3. Testleri çalıştır: npm test"
echo "4. Docker ile başlat: docker-compose -f docker/docker-compose.yml up -d"

echo ""
