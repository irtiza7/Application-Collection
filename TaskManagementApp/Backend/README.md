# Task Management Application (Backend)

## Description

An evaluation application made for user's task management. Used ExpressJS for writing the RESTful API and MySQL Server for persistent storage of tasks and users. 

## Tools

1. ExpressJS - API
2. MySQL Server - Database
3. Bcrypt - Password Hashing and barebones Authentication
4. Sequelize - Database ORM

## Installation

1. Install [Node.js](https://nodejs.org/) and [MySQL](https://www.mysql.com/) server.
2. Provide the database name and other credentials in the `.env` file.
3. Run the command `npm install` to install the required packages and libraries.

## Database in Docker Container
1. You can also use containerized MySql instance.
2. For that first install [Docker](https://docs.docker.com/engine/install/) on the system.
3. Run the command "docker run --name mydb -e MYSQL_ROOT_PASSWORD=123456 -p 4000:3306 -d mysql:latest"
4. This will start MySql server in a docker container, listening on port 4000. 

## Usage

1. Run the command `nodemon server.js` to start the server.
2. The server will run on port 4201.
