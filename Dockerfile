FROM alpine:latest
RUN apk add nodejs npm --no-cache
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 8000
CMD ["npm", "run", "start:dev"]