import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import customerRoutes from './src/routes/customers.routes.js'; // <-- TAMBAHKAN INI
import dashboardRoutes from './src/routes/dashboard.routes.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send("API Backend Berjalan Lancar! 🚀");
});

// Gunakan route pelanggan dengan prefix /api/customers (Sesuai PRD)
app.use('/api/customers', customerRoutes); // <-- TAMBAHKAN INI
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Halo! Server Backend Data Management System sudah menyala 🚀');
});

app.listen(PORT, () => {
  console.log(`Server berhasil berjalan di http://localhost:${PORT}`);
});

export default app;