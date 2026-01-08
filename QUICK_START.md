# Quick Start Guide

## Step-by-Step Setup

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (copy from env.example.txt)
# Windows: copy env.example.txt .env
# Mac/Linux: cp env.example.txt .env

# Edit .env file and replace <db_password> with your MongoDB Atlas password
```

**Important**: 
- Get your MongoDB Atlas password from your account
- Replace `<db_password>` in the MONGO_URI with your actual password
- Keep the JWT_SECRET secure (use a random string)

### 2. Frontend Setup (2 minutes)

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
You should see: `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173`

### 4. Access the Application

1. Open browser: `http://localhost:5173`
2. Click "Register" to create an account
3. Choose role: "Donor" or "Volunteer"
4. Login with your credentials

### 5. Create Admin User (Optional)

To create an admin user:
1. Register normally as a donor
2. Go to MongoDB Atlas
3. Find your user in the `users` collection
4. Change `role` field from `"donor"` to `"admin"`

Or use MongoDB Compass to edit the user document.

## Common Issues

### "MongoDB connection error"
- Check your password in `.env` file
- Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)
- Ensure connection string format is correct

### "Port 5000 already in use"
- Change PORT in backend `.env` file to another port (e.g., 5001)
- Update FRONTEND_URL if you change the port

### "Cannot find module"
- Run `npm install` again in the respective folder
- Delete `node_modules` and `package-lock.json`, then reinstall

## First Steps After Login

1. **As Donor:**
   - View campaigns
   - Make a donation (simulated)
   - View donation history

2. **As Admin:**
   - Create a campaign
   - View dashboard analytics
   - Manage users
   - Generate reports

3. **As Volunteer:**
   - Wait for task assignment (admin/staff assigns tasks)
   - Update task status
   - Download certificate when completed

## Testing the System

1. **Create a Campaign (Admin):**
   - Go to Campaigns page
   - Click "Create Campaign"
   - Fill in details and save

2. **Make a Donation (Donor):**
   - Go to Campaigns
   - Click "View" on a campaign
   - Or go to Donations page and click "Donate"
   - Fill in amount and payment method
   - Submit (simulated payment)

3. **Download Receipt:**
   - Go to Donations page
   - Click "Download Receipt" on completed donations

## Need Help?

1. Check the main README.md for detailed documentation
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas is accessible
4. Check browser console for frontend errors
5. Check terminal for backend errors

---

**Happy Coding! 🎉**
