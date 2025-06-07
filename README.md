
# URL Shortening Service App

URL Shortening Service App is a web application used to **shorten a URL** that you can do **many times**.

This application is created separately for the frontend and backend. The frontend application is created using only **HTML**, **CSS**, and **JavaScript**, and with a little touch of the **Tailwind CSS** framework. Meanwhile, the backend application is created using the **Fastify** framework in the **JavaScript** programming language. Why do I use Fastify? Because Fastify claims to be faster and lighter in terms of overhead than all website creation frameworks that use the JavaScript language.

In addition, the DBMS (Database Management System) used to store URL data is **MySQL**. MySQL excels in reading and retrieving data. Therefore, I use MySQL for database management.




## Features ✅

- Simple and **Easy-to-use**
- The **length of the URL** (to be shortened) can be up to **65,535 characters**
- The **total number of URLs** that can be shortened can be up to **56M+** or 56,800,235,584 urls
- The use of **CORS** and **Rate Limiting** in terms of API security


## Demo 💻

My Published Web: https://urlshortsrv.vercel.app


## Run Locally 🖥

- Clone the project

```bash
  git clone https://github.com/RizkySugiharto/URL-Shortening-Service-App.git
```

- Go to the `/backend` directory

```bash
  cd project/backend
```

- Install dependencies for backend app

```bash
  npm install
```

- Create database (if doesn't exists) and import the `/schemas/db.sql` to your database

- Setup the env file on `/backend/.env` (create one if doesn't exists)

- Start the backend in development (dev) or production (prod)

```bash
  npm run dev
```


## Environment Variables (backend) ⚙

To run the backend app, you will need to add the following environment variables to your `.env` file in `/backend` directory (create if doesn't exists)

- `NODE_ENV` (Default: "development") Can be "production" or "development".
- `API_VERSION` (Default: 1) Version of API, but the available version is only 1.
- `PORT` (Default: 3000) Port number of the backend app.
- `ALLOWED_ORIGINS` (Default: '\*') Use '\*' to allow all websites to access the API. However, if you want to give access to only a few websites, you can use their url/domains and separate them with spaces. For example: `'http://localhost:8000 http://localhost:5500 https://mydomain.com'`
- `ALLOWED_REQUEST_PER_MINUTE` (Default: 100) This determines how many clients are allowed to access the API for each client.
- `MYSQL_HOST` (Default: '') Use the hostname used to host your MySQL server.
- `MYSQL_PORT` (Default: 3306) The port number of your MySQL server
- `MYSQL_USER` (Default: '') Username of your MySQL server
- `MYSQL_PASSWORD` (Default: '') Password of your MySQL server
- `MYSQL_DATABASE` (Default: '') The database you will use on your MySQL server
- `MYSQL_CONNECTION_LIMIT` (Default: 5) Connection limits from backend app to MySQL server
- `SHORTER_MAX_LENGTH` (Default: 6) The number of short code characters in the shortened URL. If you set it to 4, the result will be like this: `http://your-url.com/XXXX`
- `ENABLE_LOGGER` (Default: true) Some hosting does not support loggers, so this is necessary so that the hosting does not experience errors.

## License 📜

[MIT](https://choosealicense.com/licenses/mit/)

