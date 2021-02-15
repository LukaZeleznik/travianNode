FROM node:14.5-alpine

RUN mkdir -p /home/node/app/

WORKDIR /home/node/app

COPY package*.json ./
COPY ["package.json", "package-lock.json*", "./"]

#RUN npm install -g nodemon

#USER node

RUN npm install -g pm2 --save

RUN npm install

COPY . .

#COPY --chown=node:node . .

EXPOSE 8080