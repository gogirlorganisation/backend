# Server backend for The Girl Code

**Dev setup:**

1. Install
  * MongoDB Community Edition: https://docs.mongodb.com/manual/administration/install-community/
  * NodeJS: https://nodejs.org
  * Python: https://python.org

2. Clone this repository

        git clone https://github.com/thegirlcode/backend.git

3. Install required packages

        cd backend

        npm install

        npm install -g nodemon

4. Create keyfile as auth/keys.js:

        module.exports = {
        	googleID: 'googleSignInID',
        	googleSecret: 'googleSignInSecret',
        	facebookID: 'facebookSignInID',
        	facebookSecret: 'facebookSignInSecret'
        };

5. Start server

  In one Terminal, open and leave running:

        mkdir ~/mongo
        mongod --dbpath ~/mongo

  In another Terminal:

        nodemon bin/www

6. Site will be at localhost:3000

Note: In order for Facebook and Google login to work on localhost, you will need to do the following:

1. Create a self-signed SSL certificate: https://stackoverflow.com/a/10176685

2. Install and setup nginx: https://nginx.org

3. Use nginx to serve the self-signed certificate: https://stackoverflow.com/a/25857318

Or any other method of serving localhost:3000 as https://localhost. Site will be live at latter URL.

**Prod setup:**

1. Install
  * MongoDB Community Edition: https://docs.mongodb.com/manual/administration/install-community/
  * NodeJS: https://nodejs.org
  * Python: https://python.org
  * Firejail: https://firejail.wordpress.com

2. Clone this repository

        git clone https://github.com/thegirlcode/backend.git

3. Install required packages

        cd backend

        npm install

        npm install -g forever


4. Create keyfile as auth/keys.js:

        module.exports = {
          googleID: 'googleSignInID',
          googleSecret: 'googleSignInSecret',
          facebookID: 'facebookSignInID',
          facebookSecret: 'facebookSignInSecret'
        };

5. Start server

  Start Mongo as system service: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#run-mongodb-community-edition

  Start forever.js server

        sudo NODE_ENV=production forever start bin/www

6. Site will be at localhost:3000. Must use nginx and certbot to create an SSL certificate and serve site over https://domain as Google and Facebook login will not work without it.