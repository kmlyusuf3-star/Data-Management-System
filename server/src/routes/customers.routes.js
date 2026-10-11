import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 1. GET: Ambil Semua Pelanggan + Pencarian + Filter + Sort
router.get('/', async (req, res) => {
  try {
    // Menangkap parameter baru: status dan sort
    const { search = '', page = 1, limit = 10, status = 'All', sort = 'newest' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Logika Pencarian & Filter Status
    const where = {
      AND: [
        search ? {
          OR: [
            { full_name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search } }
          ]
        } : {},
        status !== 'All' ? { status: status } : {}
      ]
    };

    // Logika Pengurutan (Sorting)
    let orderBy = { createdAt: 'desc' }; // default: Paling Baru
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'name_asc') orderBy = { full_name: 'asc' };
    if (sort === 'name_desc') orderBy = { full_name: 'desc' };

    const [customers, totalItems] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy
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

// 2. POST: Tambah Pelanggan Baru
router.post('/', async (req, res) => {
  try {
    const { full_name, email, phone, company, status } = req.body;
    if (!full_name || !email || !phone) return res.status(400).json({ error: { message: "Data wajib diisi." } });
    
    const existingEmail = await prisma.customer.findUnique({ where: { email } });
    if (existingEmail) return res.status(409).json({ error: { message: "Email sudah digunakan." } });

    const newCustomer = await prisma.customer.create({
      data: { full_name, email, phone, company, status: status || "Active" }
    });
    res.status(201).json({ data: newCustomer });
  } catch (error) {
    res.status(500).json({ error: { message: "Internal Server Error" } });
  }
});

// 3. GET: Detail Pelanggan
router.get('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { id: req.params.id } });
    if (!customer) return res.status(404).json({ error: { message: "Tidak ditemukan" } });
    res.status(200).json({ data: customer });
  } catch (error) {
    res.status(500).json({ error: { message: "Internal Server Error" } });
  }
});

// 4. PUT: Edit Pelanggan
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, company, status } = req.body;
    
    const existingEmail = await prisma.customer.findFirst({ where: { email, NOT: { id } } });
    if (existingEmail) return res.status(409).json({ error: { message: "Email sudah digunakan" } });

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: { full_name, email, phone, company, status }
    });
    res.status(200).json({ data: updatedCustomer });
  } catch (error) {
    res.status(404).json({ error: { message: "Tidak ditemukan" } });
  }
});

// 5. DELETE: Hapus Pelanggan
router.delete('/:id', async (req, res) => {
  try {
    await prisma.customer.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Berhasil dihapus" });
  } catch (error) {
    res.status(404).json({ error: { message: "Tidak ditemukan" } });
  }
});

export default router;