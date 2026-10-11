import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import customerRoutes from './src/routes/customers.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 1. Rute Halaman Depan (Cukup satu saja)
app.get('/', (req, res) => {
  res.send("API Backend Berjalan Lancar di Vercel! 🚀");
});

// 2. Rute Utama (Kita HAPUS tulisan '/api' agar 100% cocok dengan Frontend)
app.use('/customers', customerRoutes);
app.use('/dashboard', dashboardRoutes);

// 3. Pencegah Error Vercel (Hanya nyalakan listen jika sedang di komputer lokal)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

export default app;