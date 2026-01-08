# Backend API Documentation

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
MONGO_URI=mongodb+srv://amarman468_db_user:<YOUR_PASSWORD>@cluster0.sbasb3p.mongodb.net/charity_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

3. Start server:
```bash
npm start
```

## API Base URL
`http://localhost:5000/api`

## Authentication
Most endpoints require JWT authentication. Include token in header:
```
Authorization: Bearer <token>
```
