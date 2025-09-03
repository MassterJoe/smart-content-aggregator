# Smart Content Aggregator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen)](https://www.mongodb.com/)

Smart Content Aggregator Service is an API that enables users to publish, interact with, and discover high-quality articles. The platform leverages AI-based summarization, rule-based recommendation systems, and analytics to enhance content discovery and user engagement.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Project Structure](#project-structure)  
- [API Endpoints](#api-endpoints)  
- [Usage](#usage)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- **User Management**: Register, login, and manage profiles.  
- **Article Management**: Create, update, view, and delete articles.  
- **Automatic Summarization**: AI-based summaries generated if not provided.  
- **Interactions**: Users can like, comment, share, bookmark, or view articles.  
- **Recommendations**: Rule-based system recommends articles based on user interests and popularity.  
- **Analytics**: Track article views and user engagement.  
- **RESTful API**: Exposed endpoints for frontend integration.  
- **Swagger Documentation**: Interactive API docs for developers.  

---

## Tech Stack

**Backend:**  
- Node.js  
- Express.js  
- TypeScript  
- TSOA (Swagger integration)  
- typedi (Dependency Injection)  

**Database:**  
- MongoDB with Mongoose ORM  

**AI / NLP:**  
- Google Gemini API for content summarization  

**Message Broker / Email:**  
- RabbitMQ  
- SMTP / SendGrid for email notifications  

---

## Getting Started

### Prerequisites

- Node.js >= 18.x  
- MongoDB >= 6.x  
- npm or yarn  
- RabbitMQ  
- `.env` file with the following variables:

```env
PORT=5000
HOST=localhost
MONGODB_URI=mongodb://localhost:27017/smart-content-aggregator
MONGO_DB_NAME=smart-content-aggregator
JWT_SECRET=your_jwt_secret
REFRESH_JWT_SECRET=your_refresh_jwt_secret
JWT_ISSUER=smart-content-aggregator
APP_URL=http://localhost:5000
GEMINI_API_KEY=your_google_gemini_api_key

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Email
MAIL_TRANSPORT=smtp://${MAIL_USER}:${MAIL_PASSWORD}@${MAIL_HOST}
SENDGRID_API_KEY=your_sendgrid_api_key
MAIL_FROM=no-reply@example.com
````

### Installation

# Clone the repo
git clone https://github.com/MassterJoe/smart-content-aggregator.git
cd smart-content-aggregator

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Project Structure

```
src/
│
├─ api/
│  ├─ controllers/
|  |-- dtos/
|  |-- enums/
|  |-- errors/
|  |-- helpers/
|  |-- interfaces/
|  |-- mail/
│  ├─ services/         
│  ├─ models/                     
│  └─ middlewares/      
│
├─ config/              
├─ ioc.ts               
├─ app.ts                       
```

---

## API Endpoints

### Articles

* `POST /articles/:userId` - Create a new article
* `PUT /articles/:id` - Update an article
* `GET /articles/:id` - Get article by ID
* `GET /articles/recommendations/:userId` - Get recommended articles

### Interactions

* `POST /interactions` - Create a new interaction (like, comment, share, etc.)
* `GET /interactions/:articleId` - Get all interactions for an article
* `DELETE /interactions/:id` - Delete an interaction

> For a complete list of endpoints and documentation, visit Swagger UI at `http://localhost:5000/api/docs`.

---

## Usage

1. Create a user and obtain JWT token.
2. Create articles using your JWT.
3. Interact with articles (like, comment, share, bookmark).
4. Fetch recommended articles based on your interests and popular articles.
5. Articles submitted without a summary will automatically generate one using AI summarization.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```