FROM node:10.15.3

WORKDIR /usr/src/client
COPY . .

RUN npm install
RUN npm audit fix

CMD [ "npm", "start" ]