FROM node:alpine AS buildstage
WORKDIR /code
COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm install
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=buildstage /code/dist ./
RUN npm install pm2 -g
EXPOSE 8080
CMD ["pm2-runtime","main.js"]