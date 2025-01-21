import { PrismaClient } from "@prisma/client";

const orm = new PrismaClient();

// index / menampilkan semua data
const index = async (req, res, next) => {
    try {
        const page = req.params.page ?? 0;
        const row_count = await orm.rFID.count();
        const offset = page * 5;
        
        const data = await orm.rFID.findMany({orderBy : {createdAt : "desc"}, skip: offset, take: 5});

        return res.status(200).json({
            message: "success",
            pagination: {
                totalPages: Math.ceil(Number(row_count) / 5),
                currentPage: page + 1
            },
            data: {
                count: row_count,
                rows: data
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// show / menampilkan data berdasarkna id
const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await orm.rFID.findFirst({ where: { id: id } });
        return res.status(200).json({
            message: "success",
            data
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


// get latest rfid scan
const get = async (req, res, next) => {
    try {
        const data = await orm.rFID.findFirst({orderBy: {id: "desc"}});
        return res.status(200).json({
            message: "success",
            data
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// membuat data berat badan baru
const create = async (req, res, next) => {
    try {
        const { chip_id } = req.params;
        const time = Date.now();
        const currentDate = new Date(time).toISOString();
        const newBody = {
            chip_id: chip_id,
            createdAt: currentDate,
            updatedAt: currentDate,
        }
        const data = await orm.rFID.create({ data: newBody });
        return res.status(200).json({
            message: "success",
            data
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


// membuat data berat badan baru
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const time = Date.now();
        const currentDate = new Date(time).toISOString();

        const updatedBody = {
            chip_id: payload.chip_id,
            updatedAt: currentDate,
        }
        const data = await orm.rfid.update({
            where: { id: Number(id) },
            data: updatedBody
        });
        return res.status(200).json({
            message: "success",
            data
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// destroy / menghapus data berdasarkan id
const destroy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await orm.rfid.delete({ where: { id: id } });

        return res.status(200).json({
            message: "success",
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export default {
    index,
    show,
    get,
    create,
    update,
    destroy
}