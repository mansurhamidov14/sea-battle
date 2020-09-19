FROM node:10.15.3

WORKDIR /usr/src/
COPY . .

RUN cd ./client && npm i 
RUN cd ./server && npm i

CMD (cd ./server && npm start) & (cd ./client && npm start)