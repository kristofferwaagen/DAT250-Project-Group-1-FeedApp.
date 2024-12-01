# Stage 1: Build the Vue.js application
FROM node:lts-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vue.js application for production
RUN npm run build

# Stage 2: Serve the built Vue.js application
FROM nginx:alpine

# Copy the built files from the builder stage to the Nginx web server's root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port that Nginx is listening on
EXPOSE 5173

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
