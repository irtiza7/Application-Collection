# Installl base images
FROM node:20-alpine

# Copy App files to container
COPY . /app/

# Change the directory to the Application's folder
WORKDIR /app/

# Install dependencies for the App
RUN npm install

# Command to be executed once the container has be started
CMD ["node", "server.js"]