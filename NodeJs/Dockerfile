FROM node:14.5-alpine

RUN mkdir -p /home/node/app/

WORKDIR /home/node/app

COPY package*.json ./

#USER node

RUN npm install 

COPY ./ ./

RUN npm install pm2 -g

#COPY --chown=node:node . .

EXPOSE 8080

CMD ["pm2-runtime", "start", "app_pm2_config.json"]