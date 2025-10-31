# Real Estate Lead Capture System

A full-stack application for capturing real estate investment leads with React frontend and Node.js microservice backend.

## Features

- **Lead Capture Form**: Collects name, email, phone, investment type, budget, and timeline
- **Investment Types**: Plot, Villa, Apartment, Commercial
- **Input Validation**: Both frontend and backend validation
- **MongoDB Storage**: Persistent data storage with Mongoose
- **TypeScript**: Full type safety across the stack
- **Responsive Design**: Mobile-friendly UI

## Project Structure

```
real-estate-leads/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/
│   │   │   ├── LeadForm.tsx
│   │   │   └── LeadForm.css
│   │   └── App.tsx
│   └── package.json
├── backend/                  # Node.js TypeScript microservice
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   └── leadController.ts
│   │   ├── middleware/
│   │   │   └── validation.ts
│   │   ├── models/
│   │   │   └── Lead.ts
│   │   ├── routes/
│   │   │   └── leadRoutes.ts
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB connection string:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/real_estate_leads
   FRONTEND_URL=http://localhost:3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Leads Management

- **POST** `/api/leads` - Create a new lead
- **GET** `/api/leads` - Get all leads (with pagination)
- **GET** `/api/leads/:id` - Get a specific lead
- **PUT** `/api/leads/:id` - Update a lead
- **DELETE** `/api/leads/:id` - Delete a lead
- **GET** `/health` - Health check endpoint

### Request/Response Examples

#### Create Lead
```json
POST /api/leads
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "investmentType": "Villa",
  "budget": "50 Lakhs",
  "timeline": "Within 6 months"
}
```

#### Response
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "id": "64abc123def456789",
    "name": "John Doe",
    "email": "john@example.com",
    "investmentType": "Villa",
    "createdAt": "2024-01-01T10:00:00.000Z"
  }
}
```

## Validation Rules

### Required Fields
- **Name**: 2-100 characters
- **Email**: Valid email format
- **Phone**: Valid phone number
- **Investment Type**: One of [Plot, Villa, Apartment, Commercial]
- **Budget**: 1-50 characters
- **Timeline**: 1-100 characters

## Database Schema

```typescript
interface ILead {
  name: string;
  email: string;
  phone: string;
  investmentType: 'Plot' | 'Villa' | 'Apartment' | 'Commercial';
  budget: string;
  timeline: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Development

1. Ensure MongoDB is running
2. Start backend server: `cd backend && npm run dev`
3. Start frontend server: `cd frontend && npm start`
4. Access the application at `http://localhost:3000`

## Architecture

This application follows a microservice architecture:

- **Frontend**: React SPA with TypeScript
- **Backend**: Express.js API with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Communication**: REST API with JSON

The backend is designed as a standalone microservice that can be independently deployed and scaled.