# Server backend for The Girl Code

**Dev setup:**

1. Install
  * MongoDB Community Edition: https://docs.mongodb.com/manual/administration/install-community/
  * NodeJS https://nodejs.org

2. Clone this repository

        git clone https://github.com/thegirlcode/backend.git

3. Install required packages

        cd backend

        npm install

        npm install -g nodemon

4. Start server

  In one Terminal, open and leave running:

        mkdir ~/mongo
        mongod --dbpath ~/mongo

  In another Terminal:

        nodemon bin/www


**Prod setup:**

tbd