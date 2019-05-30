FROM node:11-stretch

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
RUN apt-get update
RUN apt-get install -y build-essential
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose ports
EXPOSE 62442

# Run app
CMD npm start 