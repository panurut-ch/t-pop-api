This is a [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

This project for T-POP Incorporation Assignment: Backend Engineer
Developed by Panurut Chinakul

## Database
- PostgreSQL

## Library
- Nest.js
- Passport.js
- Bcrypt.js
- Swagger
- Jest
- Prisma
- class-validator
- Redis

## How to run local
```bash
npm install
```
```bash
npm run start:dev
```
API will live on
```bash
http://localhost:3001/
```
url : http://localhost:3001/

## How to run with Docker
```bash
docker-compose build --no-cache
```
```bash
docker-compose up -d
```
API will live on
```bash
http://localhost:3000/
```
url : http://localhost:3000/

## API Document
```bash
http://localhost:3000/api/
```
url : http://localhost:3000/api/

![api_doc](https://cdn.discordapp.com/attachments/1109223763075154001/1226820281574756414/image.png?ex=6626286c&is=6613b36c&hm=0551abc8ca2573de4934fb4c88ebb74376aad7dd364735b48dc068ae7a3254a1&) 

## Unit Test
test auth service
```bash
npm run test:auth
```
test seat service
```bash
npm run test:seat
```
![test_auth](https://cdn.discordapp.com/attachments/1109223763075154001/1226820569316458496/image.png?ex=662628b0&is=6613b3b0&hm=0af3676389e561d0f89bc2e4a72dff126af8497ab86d3e08b005d0ee3cbd629d&)  

![test_seat](https://cdn.discordapp.com/attachments/1109223763075154001/1226820730814205982/image.png?ex=662628d7&is=6613b3d7&hm=7fd4e92bc52f8b206aa503f5e95ff1d85981d35ede5957728ae38f46e0d12a43&)

## Caching with Redis  
Caching data for API `/api/v1/events/filter` : list events data  

![redis](https://cdn.discordapp.com/attachments/1109223763075154001/1226821419023732746/image.png?ex=6626297b&is=6613b47b&hm=dedff794c308350bf12a76df254572405aeda6059d2615d6e051e255e98c50d3&)  

## User & Password for test
email: panurut@panurut.dev  
password: password-panurut

email: hello@t-pop.com  
password: password-t-pop
