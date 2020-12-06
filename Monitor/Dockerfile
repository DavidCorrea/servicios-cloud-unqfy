# docker network create --subnet=172.20.0.0/16 unqfynet (Con hacerlo una sola vez para todos los servicios alcanza)

# Comandos utiles:
# - Acceder a Bash: docker exec -it cloud-monitor /bin/sh
# - Remover la imagen: docker image rm cloud-monitor
# - Remover el container: docker container rm cloud-monitor

# Correr desde /Monitor
# > docker build -t cloud-monitor .
# > docker run --name cloud-monitor --env-file ./.env --network unqfynet --ip 172.20.0.23 -p 3003:3000 cloud-monitor:latest

FROM node:14.4-alpine3.12

ENV PORT=3000

RUN apk add git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]