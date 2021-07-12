# Interview Assignment (v1.0.1)

This package contains the base code for the interview assignment.<br>
You can add additional library that will aid you in fulfiling the requirements.
<br>
<br>
Please read through NodeJS_Assessment_v2.docx carefully before you attempt.

## Prerequisites
- NodeJS v14.17.0
- Docker Desktop 3.4.0 (Docker Engine 20.10.7)

<br>

## Package Structure
| S/N | Name | Type | Description |
|-----|------|------|-------------|
| 1 | external | dir | This holds the code for building external system which is required for question 2.<br><b>There is no need to modify anything inside or start it manually</b>
| 2 | typescript | dir | This holds the base code which you should extend in order to fulfil the requirements |
| 3 | NodeJS_Assessment_v2.docx | file | The specification for the assignment |
| 4 | README.md | file | This file |
| 5 | data.sample.csv | file | Sample csv for question 1 |
| 6 | school-administration-system.postman_collection.json | file | Postman script for uploading file |
| 7 | react-typescript | dir | This holds the additional code which is developed for React for front-end to integrate with the backend APIs |

<br>

## Exposed Port
| S/N | Application | Exposed Port |
|-----|-------------|--------------|
| 1 | database | 3306 |
| 2 | external | 5000 |
| 3 | backend API application | 3000 |
| 3 | react application | 2999 |

<br>

## Commands
All the commands listed should be ran in either ./typescript or ./react-typescript directory, depending on which service to start up.
For all services to work, it is required to start up ./typescript first, followed by ./react-typescript.

### Installing dependencies (for ./typescript & ./react-typescript)
```bash
npm install
```

<br>

### Starting Project (for ./typescript & ./react-typescript)
Starting the project in local environment.
This will start all the dependencies services i.e. database and external (folder).
Ensure Docker Desktop (or equivalent) is running before running command.
```bash
npm start
```

<br>

### Running in watch mode (for ./typescript only)
This will start the application in watch mode.
Ensure Docker Desktop (or equivalent) is running before running command.
```bash
npm run start:dev
```

<br>

### Unit Testing (for ./typescript only)
This will run the Unit Test using Jest.
```bash
npm run test
```

<br>

### Check local node.js application is started (for ./typescript only)
You should be able to call (GET) the following endpoint and get a 200 response

```
http://localhost:3000/api/healthcheck
```

<br>

### Check external system is started (for ./typescript only)
You should be able to call (POST) the following endpoint and get a 200 response
```
  http://localhost:5000/students?class=2&offset=1&limit=2
```

<br>

### Check local react application is started (for ./react-typescript only)
You should be able to load a simple web application page with navigations

```
http://localhost:2999/
```

<br>

## Extras

### Database
You can place your database migration scripts in typescript/database folder. <br>
It will be ran the first time MySQL docker container is first initialised. <br><br>
Please provide the instruction on how to initialise the database if you are not using the above method.

<br>

## FAQ

### Error when starting up
If you encounter the following error when running ```npm start```, it is due to the slow startup of your database container.<br>
Please run ```npm start``` again.

```
[server.js]	ERROR	SequelizeConnectionError: Connection lost: The server closed the connection.
[server.js]	ERROR	Unable to start application
```

<br>

### How do I upload file to /api/upload?
You can import the included postman script (school-administration-system.postman_collection.json) into your postman.
