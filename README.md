# Meat Livestock Server

## Description
The Meat Livestock Server is a Node.js backend for the Meat and Livestock selling application. It is built using Express.js and provides a robust and secure API for client applications. The server handles user authentication and authorization, and exposes various endpoints for managing products, orders, users, and more.

## Features
- Authentication and authorization for users, sellers, and admins using JWT.
- Secure password storage with bcrypt.
- RESTful API design with clear and consistent endpoints.
- Modular architecture with routes, controllers, and middlewares.
- Integration with MongoDB for data storage.

## Technologies Used
- Node.js
- Express.js
- JWT (JSON Web Tokens)
- MongoDB
- Mongoose
- Bcrypt

## Installation Instructions

1. **Clone the repository**:
   ```sh
   git clone https://github.com/yourusername/meat-livestock-server.git
   cd meat-livestock-server
2. Install dependencies:
   ```sh
   npm install
3. Configure Environment Variables:
   Create a .env file in the root of your project and add the necessary configuration.
   ```sh
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
4. Run the server:
   ```sh
   npm start
   
## Created Date
This project was created on Jan 10, 2022.


