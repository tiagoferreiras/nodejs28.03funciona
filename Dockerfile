FROM node:19-bullseye-slim
RUN apt-get update && apt-get install -y \
mysql-server
EXPOSE 3306
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
CMD ["npm", "start"]