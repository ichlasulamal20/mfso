import { PrismaClient } from "@prisma/client";

const orm = new PrismaClient();

// index / menampilkan semua data
const index = async (req, res, next) => {
    try {
        const page = req.params.page ?? 0;
        const row_count = await orm.sensor.count();
        const offset = page * 5;
        const data = await orm.sensor.findMany({skip: offset, take: 5});

    
        return res.status(200).json({
            message: "success",
            pagination: {
                totalPages: Math.ceil(Number(row_count) / 5),
                currentPage: page + 1
            },
            data: {
                count: row_count,
                rows : data
            }
        });

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}

// tambahkan sensor baru
const create = async (req, res, next) => {
    try {
        const {nama_sensor} = req.body;
        const currentDate = new Date(); 
        const newBody = {
            nama_sensor : nama_sensor,
            createdAt : currentDate,
            updatedAt : currentDate
        }
        const data = await orm.sensor.create({data: newBody});

        return res.status(200).json({
            message: "success",
            data
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
        
    }
}



export default {
    index,
    create
}