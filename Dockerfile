FROM node:14.5-alpine

#RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install -g nodemon --save

#USER node

#RUN npm install -g pm2

RUN npm install

COPY . .

#COPY --chown=node:node . .

EXPOSE 8080

CMD [ "nodemon", "app.js" ]