# Server backend for The Girl Code

## Setup

1. Install

- Docker Community Edition: https://docs.docker.com/install/
  [Here's](https://medium.freecodecamp.org/comprehensive-introductory-guide-to-docker-vms-and-containers-4e42a13ee103) a nice article if you're unfamiliar with Docker.

2. Clone this repository

```sh
git clone https://github.com/thegirlcode/backend.git
```

3.  Create keyfile as auth/keys.js:

```js
module.exports = {
	googleID: 'googleSignInID',
	googleSecret: 'googleSignInSecret',
	facebookID: 'facebookSignInID',
	facebookSecret: 'facebookSignInSecret'
};
```

4. Build docker images

```sh
docker-compose build
```

5. Start containers

```sh
docker-compose up -d mongo
```

You need to wait a few seconds for the mongodb daemon to start and then you can start the web container with

```sh
docker-compose up web
```

6. Site will be at localhost:62442

Note: In order for Facebook and Google login to work on localhost, you will need to do the following:

1. Create a self-signed SSL certificate:
   https://github.com/FiloSottile/mkcert

2. Install and setup nginx: https://nginx.org

3. Use nginx to serve the self-signed certificate: https://stackoverflow.com/a/25857318

Or any other method of serving localhost:62442 as https://localhost. Site will be live at latter URL.

7. You'll need to use nginx and certbot to create an SSL certificate and serve site over https://domain for production as Google and Facebook login will not work without it.
