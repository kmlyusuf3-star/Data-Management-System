import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 1. GET: Ringkasan Dashboard (Total, Active, Inactive, Baru bulan ini) (US-01)
router.get('/summary', async (req, res) => {
  try {
    const total = await prisma.customer.count();
    const active = await prisma.customer.count({ where: { status: 'Active' } });
    const inactive = await prisma.customer.count({ where: { status: 'Inactive' } });
    
    // Hitung pelanggan baru bulan ini
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newThisMonth = await prisma.customer.count({ where: { createdAt: { gte: startOfMonth } } });

    res.status(200).json({ data: { total, active, inactive, newThisMonth } });
  } catch (error) {
    res.status(500).json({ error: { message: "Internal Server Error" } });
  }
});

// 2. GET: Data Grafik 6 Bulan Terakhir (US-02)
router.get('/customer-growth', async (req, res) => {
  try {
    const monthsLimit = parseInt(req.query.months) || 6;
    const chartData = [];

    // Looping mundur untuk mendapatkan data bulan per bulan secara dinamis
    for (let i = monthsLimit - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' }); // Contoh: 'Jan', 'Feb'

      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const count = await prisma.customer.count({
        where: { createdAt: { gte: start, lte: end } }
      });
      chartData.push({ name: monthName, total: count });
    }

    res.status(200).json({ data: chartData });
  } catch (error) {
    res.status(500).json({ error: { message: "Internal Server Error" } });
  }
});

export default router;