# server

## Prerequisites

You need `npm` package manager **or** `yarn` package manager installed on your machine for this project.

NPM (Node Package Manager) is installed when you install Node.js

**Note** : You need Node.js **v10** or higher

-   [Install Node.js on your machine](https://nodejs.org/en/download/)
-   [Install Yarn on your machine](https://classic.yarnpkg.com/en/docs/install)

## Setup the project

The following command allow you to install all the dependencies needed in order to run the project on your machine exactly the way it is intended to.

**for `yarn` package manager**

```
yarn install
```

**for `npm` package manager**

```
npm install
```

**Note** : You might need to run npm install with sudo / admin rights.

## Setup .env file(s)

Next step is to setup .env files for our project.

For using `start` script to run the server

-   create a file `.env.prod` at the root of the project
-   write the following inside the file :

```
MONGODB_URL="<db-cluster string>"
PORT=3000
```

-   **Without the "<>"** in the MONGODB_URL string value.
-   `db-cluster-string` is the cluster string you get from your MongoGB Cloud Cluster to connect to the MongoDB to your application

## Run the Server

Run the `start` script to start the server on your machine.

The command to run the `start` script :

```
npm run start
```

Successful execution of the above command should look like :

```
❯ npm run start

> server@1.0.0 start /mnt/c/Users/kismet/Git/server
> cross-env NODE_ENV=prod npx nodemon app.js

[nodemon] 2.0.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
http://localhost:3000
```

## Lints and Fixes for files

To lint the file(s) in order to see what's wrong, run the command :

```
npm run lint
```

To show and fix(if fixable) what's wrong in the file(s), run the command :

```
npm run fix
```

### **_Some common errors and their fixes_**

1. If you get the following error :

```
'cross-env' is not recognized as an internal or external command,
operable program or batch file.
```

that means `cross-env` didn't install on your machine. To install it, run :

```
npm install cross-env -g
```

**Note** : To install npm packages `globally` using `-g` flag, you might get an error that you don't have rights to install it. So run it with `admin` / `sudo` rights.

2.  If your `npm install` terminate unsuccesfully and on running it again don't install the dependencies and keep failing then the following commands might come handy :

`npm cache verify`

`npm cache clean`

`npm cache clean --force`

3. If you get the following error when you execute `npm run start` command :

```
server/node_modules/mongoose/lib/connection.js:579
    throw new MongooseError('The `uri` parameter to `openUri()` must be a ' +
    ^
Error [MongooseError]: The `uri` parameter to `openUri()` must be a string, got "undefined". Make sure the first parameter to `mongoose.connect()` or `mongoose.createConnection()` is a string.
```

This means that you haven't defined the MongoDB Cluster URL and Port. Make sure you have created and setup your `.env.prod` file.
