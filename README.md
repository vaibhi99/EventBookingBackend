# EventBookingBackend

[Live Website](https://event-booking-self.vercel.app/)

A backend API for event booking, ticketing, payments, and user management.

## Features

- User authentication and authorization
- Event creation and management
- Category and comment support
- Ticket booking and QR code generation
- Payment integration (Razorpay)
- Rating and review system
- Email notifications
- Cloudinary file uploads

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Cloudinary
- Razorpay
- Ngrok

## Project Structure

```
.
├── config/           # Configuration files (Cloudinary, DB, Razorpay, Ngrok)
├── controllers/      # Route controllers (Auth, Events, Payment, etc.)
├── middlewares/      # Express middlewares (Auth, Blocked check)
├── models/           # Mongoose models (User, Event, Ticket, etc.)
├── routes/           # API route definitions
├── utils/            # Utility functions (QR code, Mail sender, etc.)
├── package.json
├── server.js         # Entry point
├── socket.js         # Socket.io integration
```

## Setup

1. Clone the repository:
   ```powershell
   git clone https://github.com/vaibhi99/EventBookingBackend.git
   cd EventBookingBackend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add your MongoDB URI, Cloudinary, Razorpay, and other secrets.

4. Start the server:
   ```powershell
   npm start
   ```

## API Endpoints

- `/api/auth` - User authentication
- `/api/events` - Event management
- `/api/tickets` - Ticket booking
- `/api/payment` - Payment processing
- `/api/category` - Event categories
- `/api/comment` - Comments on events
- `/api/rating_review` - Ratings and reviews

## License

MIT
