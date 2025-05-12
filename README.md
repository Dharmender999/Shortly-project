# Shortly-project

A simple URL shortener application with user authentication built using Express.js, MongoDB, and bcrypt.

## Features
- User signup and login with authentication
- URL Shortening: Users can shorten long URLs to a unique short URL.
- URL shortening functionality
- User-specific URLs: Each user has a unique page to view and manage their shortened URLs.
- Session management: User sessions are managed securely using cookies.
- Error Handling: Displays proper error messages for invalid URLs, login issues, and session errors.
- Security: Passwords are hashed using bcrypt, and sessions are secured with a secret key.

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root of the project with the following content:
      MONGO_URI=your-mongodb-connection-url
      SESSION_SECRET=your-session-secret-key

