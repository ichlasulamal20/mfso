import { PrismaClient } from "@prisma/client";
import util from '../controllers/util.js';

const { getAge } = util;
const orm = new PrismaClient();

// index / menampilkan semua data
const index = async (req, res, next) => {
    try {
        const page = Number(req.query.page) ? Number(req.query.page) - 1 : 0;
        const row_count = await orm.domba.count();
        const offset = page * 100;

        const rec = await orm.domba.findMany({
            orderBy: { createdAt: "desc" },
            skip: offset, take: 100
        });

        const formattedData = await Promise.all(rec.map(async (data) => {
            const loadcellBadan = await orm.loadcellBadan.findFirst({
                where: { chip_id: data.id },
                orderBy: { createdAt: "desc" }
            });
            const loadcellPakan = await orm.loadcellPakan.findFirst({
                where: { chip_id: data.id },
                orderBy: { createdAt: "desc" }
            });
            const aht = await orm.aht.findFirst({
                where: { chip_id: data.id },
                orderBy: { createdAt: "desc" }
            });
            const mpu = await orm.mpu.findFirst({
                where: { chip_id: data.id },
                orderBy: { createdAt: "desc" }
            });

            return {
                ...data,
                usia: getAge(data.usia),
                berat: loadcellBadan?.berat ?? null,
                berat_pakan: loadcellPakan?.berat_pakan ?? null,
                suhu: aht?.suhu ?? null,
                kelembapan: aht?.kelembapan ?? null,
                tinggi: mpu?.tinggi ?? null,
                kondisi: mpu?.kondisi ?? null
            };
        }));

        console.log("Formatted Data:", formattedData); // Add logging here

        return res.status(200).json({
            message: "success",
            pagination: {
                totalPages: Math.ceil(Number(row_count) / 5),
                currentPage: page + 1
            },
            data: {
                count: row_count,
                rows: formattedData
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// membuat data baru
const create = async (req, res, next) => {
    try {
        const { id, nama_domba, usia, jenis_kelamin } = req.body;
        const birthDate = new Date(usia);
        const time = Date.now();
        const currentDate = new Date(time).toISOString();

        const response = await orm.domba.create({
            data: {
                "id": id,
                "nama_domba": nama_domba,
                "usia": birthDate,
                "jenis_kelamin": jenis_kelamin,
                "createdAt": currentDate,
                "updatedAt": currentDate
            }
        });
        return res.status(200).json({
            message: "success",
            data: response
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
// menampilkan satu data
const show = async (req, res, next) => {
    try {
        const { chip_id } = req.params;

        const rec = await orm.domba.findFirst({
            where: { id: chip_id }
        });

        if (!rec) {
            return res.status(404).json({ message: "Data not found" });
        }

        const loadcellBadan = await orm.loadcellBadan.findFirst({
            where: { chip_id: rec.id },
            orderBy: { createdAt: "desc" }
        });
        const loadcellPakan = await orm.loadcellPakan.findFirst({
            where: { chip_id: rec.id },
            orderBy: { createdAt: "desc" }
        });
        const aht = await orm.aht.findFirst({
            where: { chip_id: rec.id },
            orderBy: { createdAt: "desc" }
        });
        const mpu = await orm.mpu.findFirst({
            where: { chip_id: rec.id },
            orderBy: { createdAt: "desc" }
        });

        const formattedData = {
            ...rec,
            usia: getAge(rec.usia),
            berat: loadcellBadan?.berat ?? null,
            berat_pakan: loadcellPakan?.berat_pakan ?? null,
            suhu: aht?.suhu ?? null,
            kelembapan: aht?.kelembapan ?? null,
            tinggi: mpu?.tinggi ?? null,
            kondisi: mpu?.kondisi ?? null
        };

        return res.status(200).json({
            message: "success",
            data: formattedData
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
// mengubah data domba
const update = async (req, res, next) => {
    try {
        const { chip_id } = req.params;
        const payload = req.body;
        const oldData = await orm.domba.findFirst({ where: { id: chip_id } });
        const time = Date.now();
        const currentDate = new Date(time).toISOString();
        const formattedUsia = new Date(payload.usia);

        const newBody = {
            id: chip_id,
            nama_domba: payload.nama_domba,
            usia: formattedUsia,
            jenis_kelamin: payload.jenis_kelamin,
            createdAt: oldData.createdAt,
            updatedAt: currentDate
        };

        const updatedData = await orm.domba.update({ where: { id: chip_id }, data: newBody });

        return res.status(200).json({
            message: "success",
            updatedData,
            oldData
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// menghapus satu domba
const destroy = async (req, res, next) => {
    try {
        const { chip_id } = req.params;
        const response = await orm.domba.delete({ where: { id: chip_id } });

        return res.status(200).json({ message: "Domba deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// dev 
const test = async (req, res, next) => {
    try {
        const data = await orm.domba.findMany();
        const formattedData = data.map(data => getAge(data.usia));
        return res.json(formattedData);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export default {
    index,
    create,
    show,
    update,
    destroy,
    test
};