# Dockerfile
FROM node:latest

WORKDIR /ricette-nestjs

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
 
RUN npm run build

COPY start.sh .
RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]

#CMD npx prisma migrate deploy && npm run start:prod

#CMD ["npm", "run", "start:prod"]
