# Use an official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of the app
COPY . .

# Expose the Vite dev server port
EXPOSE 8080

# Start the dev server
CMD ["npm", "run", "dev"]
