FROM node:10.14.2
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN yarn install
