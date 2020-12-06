# docker network create --subnet=172.20.0.0/16 unqfynet (Con hacerlo una sola vez para todos los servicios alcanza)

# Comandos utiles:
# - Acceder a Bash: docker exec -it cloud-logging /bin/sh
# - Remover la imagen: docker image rm cloud-logging
# - Remover el container: docker container rm cloud-logging

# Correr desde /Logging
# > docker build -t cloud-logging .
# > docker run --name cloud-logging --env-file ./.env -v $(pwd)/logs:/usr/src/app/logs --network unqfynet --ip 172.20.0.22 -p 3002:3000 cloud-logging:latest

FROM node:14.4-alpine3.12

ENV PORT=3000

RUN apk add git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]