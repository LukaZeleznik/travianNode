# OpenAir

Full stack web application using Node.js, Express.js, Vue.js, MongoDB and Nginx.

# Requirements
- Docker
- Docker Compose

# Usage

1. Fork the repository
2. Open a terminal inside the root folder and run:
```properties
docker-compose up --build -d
```
3. Open up the nginx container with:
```properties
docker exec -it nginx bash
```
4. In the container, run:
```properties
npm run serve
```
5. Open up your browser and navigate to:
```properties
http://localhost:81/install
```

7. Install and login with:
```properties
Username: admin@test.com
Password: password
```
9. Play!

<b>Extras<b>
- Connect to MondoDB with 'mongodb://multiHunter:multiHunter1@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false'
<br>

![OpenAir Travian](https://i.imgur.com/cnzcfUQ.png)
