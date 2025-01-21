import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/hello', async (req, res) => {
    try {
        const data = await prisma.exampleModel.findMany(); // Ganti 'exampleModel' dengan nama model Anda
        res.json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

export default router;