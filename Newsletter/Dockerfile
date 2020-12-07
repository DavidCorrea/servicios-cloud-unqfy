# docker network create --subnet=172.20.0.0/16 unqfynet (Con hacerlo una sola vez para todos los servicios alcanza)

# Comandos utiles:
# - Acceder a Bash: docker exec -it cloud-newsletter /bin/sh
# - Remover la imagen: docker image rm cloud-newsletter
# - Remover el container: docker container rm cloud-newsletter

# Correr desde /Newsletter
# > docker build -t cloud-newsletter .
# > docker run --name cloud-newsletter --env-file ./.env -v $(pwd)/data:/usr/src/app/data --network unqfynet --ip 172.20.0.21 -p 3001:3000 cloud-newsletter:latest

FROM node:14.4-alpine3.12

ENV PORT=3000

RUN apk add git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]