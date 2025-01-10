# Use the official Nginx image
FROM nginx:alpine

# Copy the Angular build output to the Nginx folder
COPY dist/pubsub-angular/ /usr/share/nginx/html

# Copy the custom nginx.conf to override default configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for the application
EXPOSE 8080

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
