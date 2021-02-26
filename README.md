# OpenAir

Full stack web application using Node.js, Express.js, Vue.js, MongoDB and Nginx.

# Requirements
- Docker

# Usage

1. Fork the repository
2. Open a terminal inside the main folder
3. Run 
```properties
docker-compose up --build
```
4. Run 
```properties
docker exec -it nginx bash
```
5. In the container, run 
```properties
npm run serve
```
6. Open up your browser and navigate to localhost:81/install
7. Install and play!

![OpenAir Travian](https://i.imgur.com/cnzcfUQ.png)
