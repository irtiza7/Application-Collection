FROM node:20

RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends bash git && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app/fe

COPY . .

RUN npm config set fetch-retry-mintimeout 100000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm install -g @angular/cli
RUN npm install --force --verbose

# Set the PATH environment variable
ENV PATH /usr/src/app/fe/node_modules/.bin:$PATH

# Expose the port
EXPOSE 4200
EXPOSE 4201

# Command to run your application
CMD ["npm", "start"]
