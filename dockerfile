# Use the official Nginx image
FROM nginx:alpine

# Copy the Angular build output to the Nginx folder
COPY dist/pubsub-angular/ /usr/share/nginx/html

# Expose port 80 for the application
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
