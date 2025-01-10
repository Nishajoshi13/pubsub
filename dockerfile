# Use the official Node.js image
FROM node:alpine

# Install http-server globally
RUN npm install -g http-server

# Set the working directory inside the container
WORKDIR /app

# Copy the Angular app's dist folder into the container
COPY dist/pubsub-angular /app

# Expose port 8080 (the port the app will be served on)
EXPOSE 8080

# Start the http-server to serve the app on port 8080
CMD ["npx", "http-server", ".", "-p", "8080"]
