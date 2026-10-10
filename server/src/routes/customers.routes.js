import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 1. GET: Ambil Semua Pelanggan & Pencarian (Sesuai PRD US-03 & US-04)
router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Pencarian berdasarkan nama, email, atau phone
    const where = search ? {
      OR: [
        { full_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ]
    } : {};

    const [customers, totalItems] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({ where })
    ]);

    const totalPages = Math.ceil(totalItems / Number(limit));

    res.status(200).json({
      data: customers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems,
        totalPages
      }
    });
  } catch (error) {
    console.error("Error GET Customers:", error);
    res.status(500).json({ error: { message: "Internal Server Error" } });
  }
});

// 2. POST: Tambah Pelanggan Baru (Sesuai PRD US-06)
router.post('/', async (req, res) => {
  try {
    const { full_name, email, phone, company, status } = req.body;

    // Validasi sederhana (wajib isi)
    if (!full_name || !email || !phone) {
      return res.status(400).json({ 
        error: { message: "Full Name, Email, dan Phone wajib diisi." } 
      });
    }

    // Cek apakah email sudah dipakai
    const existingEmail = await prisma.customer.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ 
        error: { message: "Email sudah digunakan oleh customer lain." } 
      });
    }

    const newCustomer = await prisma.customer.create({
      data: { full_name, email, phone, company, status: status || "Active" }
    });

    res.status(201).json({ data: newCustomer });
  } catch (error) {
    console.error("Error POST Customer:", error);
    res.status(500).json({ error: { message: "Internal Server Error" } });
  }
});

// (Nanti kita tambah fitur Detail, Edit, dan Hapus di sini)
// 3. GET: Ambil Detail Satu Pelanggan (US-07)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) return res.status(404).json({ error: { message: "Pelanggan tidak ditemukan" } });
    res.status(200).json({ data: customer });
  } catch (error) {
    res.status(500).json({ error: { message: "Internal Server Error" } });
  }
});

// 4. PUT: Edit Data Pelanggan (US-08)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, company, status } = req.body;

    // Cek apakah email yang mau diubah sudah dipakai orang lain
    const existingEmail = await prisma.customer.findFirst({ where: { email, NOT: { id } } });
    if (existingEmail) return res.status(409).json({ error: { message: "Email sudah digunakan" } });

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: { full_name, email, phone, company, status }
    });
    res.status(200).json({ data: updatedCustomer });
  } catch (error) {
    res.status(404).json({ error: { message: "Pelanggan tidak ditemukan" } });
  }
});

// 5. DELETE: Hapus Pelanggan (US-09)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.customer.delete({ where: { id } });
    res.status(200).json({ message: "Pelanggan berhasil dihapus" });
  } catch (error) {
    res.status(404).json({ error: { message: "Pelanggan tidak ditemukan" } });
  }
});

export default router;