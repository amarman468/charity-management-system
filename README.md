# As-Shawkani Foundation Charity Management System

A complete, full-stack charity management system built with Node.js, Express, React, and MongoDB Atlas. This system manages donations, campaigns, volunteers, beneficiaries, and generates reports with full transparency.

## 🚀 Features

- **Role-Based Access Control**: Admin, Donor, Volunteer, and Staff roles
- **Campaign Management**: Create, update, and manage charity campaigns
- **Donation System**: Simulated payment gateway (bKash, Nagad, Bank, Card)
- **Volunteer Management**: Task assignment and tracking
- **Beneficiary Management**: Application review and aid distribution tracking
- **Analytics Dashboard**: Real-time statistics and charts
- **Reports**: Weekly/monthly reports with PDF and CSV export
- **Multi-language Support**: English and Bangla
- **PDF Generation**: Receipts and certificates

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier works)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd As-Shawkani-Foundation-Charity-Management-System
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb+srv://amarman468_db_user:<YOUR_PASSWORD>@cluster0.sbasb3p.mongodb.net/charity_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Important**: Replace `<YOUR_PASSWORD>` with your actual MongoDB Atlas password.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📱 Usage

### 1. Register/Login

- Navigate to `http://localhost:5173`
- Register a new account (choose role: Donor or Volunteer)
- Or login with existing credentials

### 2. Admin Access

To create an admin user, you can:
- Register normally and manually update the role in MongoDB
- Or use MongoDB Compass/Atlas to set a user's role to "admin"

### 3. Features by Role

#### Admin
- Manage all users
- Create/update/close campaigns
- View all donations
- View analytics dashboard
- Generate reports
- Manage beneficiaries

#### Donor
- View active campaigns
- Make donations (simulated)
- View donation history
- Download receipts

#### Volunteer
- View assigned tasks
- Update task status
- Download participation certificates

#### Staff
- Review beneficiary applications
- Approve/reject beneficiaries
- Track aid distribution
- Generate reports

## 📁 Project Structure

```
As-Shawkani-Foundation-Charity-Management-System/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Auth & error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── utils/                 # PDF generation
│   ├── server.js              # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React contexts
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── utils/             # Utilities
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   └── package.json
└── README.md
```

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and automatically included in API requests.

## 💳 Payment Simulation

**Important**: This system uses SIMULATED payments. No real money is processed. The payment gateway simulates:
- 95% success rate
- Transaction ID generation
- Payment method validation

## 📧 SMS & Email Simulation

SMS and email notifications are stored in the database but not actually sent. This is due to zero-budget constraints.

## 📊 Database Models

- **User**: Authentication and user information
- **Campaign**: Charity campaigns
- **Donation**: Donation records
- **VolunteerTask**: Volunteer task assignments
- **Beneficiary**: Beneficiary applications
- **Notification**: System notifications

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get single campaign
- `POST /api/campaigns` - Create campaign (Admin)
- `PUT /api/campaigns/:id` - Update campaign (Admin)
- `DELETE /api/campaigns/:id` - Delete campaign (Admin)

### Donations
- `POST /api/donations` - Create donation
- `GET /api/donations` - Get donations
- `GET /api/donations/:id` - Get single donation

### Volunteers
- `GET /api/volunteer/tasks` - Get tasks
- `POST /api/volunteer/tasks` - Create task (Admin/Staff)
- `PATCH /api/volunteer/tasks/:id/status` - Update task status

### Beneficiaries
- `GET /api/beneficiaries` - Get beneficiaries (Staff/Admin)
- `POST /api/beneficiaries` - Create application (Public)
- `PATCH /api/beneficiaries/:id/review` - Review application (Staff/Admin)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data (Admin)
- `GET /api/analytics/reports` - Get reports (Admin/Staff)

### PDF
- `GET /api/pdf/receipt/:donationId` - Download receipt
- `GET /api/pdf/certificate/:taskId` - Download certificate

## 🛡️ Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 30 days
- Role-based access control on all routes
- CORS enabled for frontend origin only

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB Atlas password is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the connection string format is correct

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using the port

### Frontend Not Connecting to Backend
- Ensure backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Verify `FRONTEND_URL` in backend `.env`

## 📝 License

This project is built for educational purposes.

## 👥 Support

For issues or questions, please check:
1. MongoDB Atlas connection
2. Environment variables
3. Node.js version compatibility

## 🎯 Future Enhancements

- Real payment gateway integration
- Real SMS/Email service integration
- Image upload for campaigns
- Advanced reporting features
- Mobile app version

---

**Built with ❤️ for As-Shawkani Foundation**
