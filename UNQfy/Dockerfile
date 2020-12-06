# docker network create --subnet=172.20.0.0/16 unqfynet (Con hacerlo una sola vez para todos los servicios alcanza)

# Comandos utiles:
# - Acceder a Bash: docker exec -it cloud-unqfy /bin/sh
# - Remover la imagen: docker image rm cloud-unqfy
# - Remover el container: docker container rm cloud-unqfy

# Correr desde /UNQfy
# > docker build -t cloud-unqfy .
# > docker run --name cloud-unqfy --env-file ./.env -v $(pwd)/data:/usr/src/app/data --network unqfynet --ip 172.20.0.20 -p 3000:3000 cloud-unqfy:latest

FROM node:14.4-alpine3.12

ENV PORT=3000

RUN apk add git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]