FROM nginx:mainline
RUN apt update
RUN apt -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt -y install nodejs
WORKDIR /var/www/opentravian
COPY ./www/opentravian/package*.json .
RUN npm install
COPY ./www/opentravian .