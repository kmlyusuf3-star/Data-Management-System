# 📊 Admin Dashboard - Data Management System

A modern, full-stack web application designed for efficient customer data management. This project was built to demonstrate a complete end-to-end flow from a React frontend to a Node.js REST API, with persistent data storage using PostgreSQL.

## 🚀 Key Features

*   **📈 Dashboard Analytics:** Real-time summary cards (Total, Active, Inactive, New Customers) and dynamic bar charts showing customer growth with adjustable time periods (3, 6, 12 months).
*   **👥 Customer Management (CRUD):** Seamlessly Add, View, Edit, and Delete customer records with instant UI updates.
*   **🔍 Smart Search & Pagination:** Server-side pagination and real-time search functionality (by name, email, or phone) capable of handling large datasets efficiently.
*   **🗂️ Filter & Sorting:** Advanced table controls to sort data alphabetically, by date, or filter by customer status.
*   **📥 CSV Export:** One-click feature to generate and download customer data as a CSV/Excel file.
*   **🛡️ Robust Error Handling:** Comprehensive frontend and backend validation, including duplicate email checks and database constraint protections.

## 💻 Tech Stack

**Frontend (Client):**
*   React.js (Vite)
*   Tailwind CSS (Styling & Responsive Design)
*   Recharts (Data Visualization)
*   Axios (HTTP Client)
*   Lucide React (Icons)

**Backend (Server):**
*   Node.js & Express.js (REST API)
*   Prisma ORM (Database connection & schema management)
*   PostgreSQL (Relational Database)

## 📁 Project Structure

This project follows a clean architecture separated into two main directories:
*   `/client`: Contains all React frontend source code, components, pages, and API services.
*   `/server`: Contains the Express server, API routes, and Prisma database schema.

## 🛠️ Getting Started / Installation

### Prerequisites
*   Node.js installed on your machine.
*   PostgreSQL installed and running.

### 1. Backend Setup
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `/server` folder and add your database connection string:
   `DATABASE_URL="postgresql://username:password@localhost:5432/data_management_db?schema=public"`
4. Run database migration: `npx prisma migrate dev --name init`
5. Start the backend server: `npm run dev` (Runs on http://localhost:5000)

### 2. Frontend Setup
1. Open a new terminal and navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Start the React development server: `npm run dev`
4. Open `http://localhost:5173` in your browser to view the application.

---
*Built as a portfolio project demonstrating Full-Stack Development capabilities.*