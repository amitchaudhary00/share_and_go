# Use official Node image
FROM node:24-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 3000

# Development command
CMD ["npm", "run", "dev"]