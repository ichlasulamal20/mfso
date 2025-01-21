import { PrismaClient } from "@prisma/client";

const orm = new PrismaClient();

// index / menampilkan semua data
const index = async (req, res, next) => {
    try {
        const data = await orm.dataDomba.findMany();
        return res.status(200).json({
            message: "success",
            data
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// show / menampilkan data berdasarkna id
const show = async (req, res, next) => {
    try {
        const {id} = req.params;
        const data = await orm.dataDomba.findFirst({where: {id : id}});
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
        const payload = req.body;
        const currentDate = new Date();
        const dataDomba_id = await orm.sensor.findFirst({select: { id: true } });
        
        // check if all data is available
        const kamera_id = await orm.kamera.findFirst({orderBy: {id: "desc"}});
        const aht_id = await orm.aht.findFirst({orderBy: {id: "desc"}});
        const loadcellBadan_id = await orm.loadcellBadan.findFirst({orderBy: {id: "desc"}});
        const loadcellPakan_id = await orm.loadcellPakan.findFirst({orderBy: {id: "desc"}});
        const mpu_id = await orm.mpu.findFirst({orderBy: {id: "desc"}});

        // create new data when all req is met
        const newBody = { 
            kamera_id : kamera_id,
            mpu_id : mpu_id,
            aht_id : aht_id,
            loadcellBadan_id : loadcellBadan_id,
            loadcellPakan_id : loadcellPakan_id,
            chip_id : payload.chip_id,
            sensor_id : dataDomba_id,
            createdAt : currentDate,
            updatedAt : currentDate,
        }
        const data = await orm.dataDomba.create({newBody});
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
        const {id} = req.params;
        const payload = req.body;
        const currentDate = new Date();
        const dataDomba_id = await orm.sensor.findFirst({ where: { nama_sensor: "loadcell badan" }, select: { id: true } });

        const updatedBody = {
            berat : payload.berat,
            chip_id : payload.chip_id,
            sensor_id : dataDomba_id,
            createdAt : currentDate,
            updatedAt : currentDate,
        }
        const data = await orm.dataDomba.update({
            where: {id: Number(id)},
            data : updatedBody
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
        
        const {id} = req.params;
        const response = await orm.dataDomba.delete({where: {id : id}});

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
    create,
    update,
    destroy
}