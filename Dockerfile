FROM node:18-alpine as base

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /src
COPY package*.json ./

# Instalamos las dependencias de Node.js
RUN npm ci


