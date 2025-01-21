import { PrismaClient } from "@prisma/client";

const orm = new PrismaClient();

// index / menampilkan semua data
const index = async (req, res, next) => {
    try {
        const page = Number(req.query.page) ? Number(req.query.page) - 1 : 1;
        const row_count = await orm.kamera.count();
        const offset = page * 5;

        const rec = await orm.kamera.findMany({
            orderBy: { id: "desc" },
            skip: offset, take: 5,
            select: {
                id: true,
                panjang: true,
                tinggi: true,
                createdAt: true,
                updatedAt: true,
                chip: {
                    select: {
                        id: true,
                        nama_domba: true,
                        jenis_kelamin: true
                    }
                }
            }
        });

        const formattedData = rec.map(data => {
            return {
                id: data.id,
                panjang: data.panjang,
                tinggi: data.tinggi,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                chip_id: data.chip.id,
                nama_domba: data.chip.nama_domba,
                jenis_kelamin: data.chip.jenis_kelamin
            }
        });

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



// graph / menampilkan data terbaru untuk grafik
const graph = async (req, res, next) => {
    try {
        const {chip_id} = req.query;
        const page = Number(req.query.page) ? Number(req.query.page) - 1 : 0;
        const row_count = await orm.kamera.count({ where: { chip_id: chip_id } });
        const offset = page * 5;

        const rec = await orm.domba.findMany({
            where: { id: chip_id },
            select: {
                id: true,
                kamera: {
                    orderBy: { id: "desc" },
                    skip: offset, take: 5,
                    select: {
                        id: true,
                        panjang: true,
                        tinggi: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        });

        const formattedData = rec.flatMap(domba =>
            domba.kamera.map((kamera, index) => ({
                id: kamera.id,
                nama_domba: domba.nama_domba,
                jenis_kelamin: domba.jenis_kelamin,
                panjang: parseFloat(kamera.panjang),
                tinggi: parseFloat(kamera.tinggi),
                createdAt: kamera.createdAt,
                updatedAt: kamera.updatedAt,
                chip_id: domba.id,
            }))
        );

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

    } catch (error) {
        res.status(500).json({ error: e.message });
    }
}

// create / menambahkan data baru
const create = async (req, res, next) => {
    try {
        const payload = req.body;
        const time = Date.now();
        const currentDate = new Date(time).toISOString();
        const sensor = await orm.sensor.findFirst({ where: { nama_sensor: "kamera" }, select: { id: true } });

        const scan = await orm.rFID.findFirst({ orderBy: { id: "desc" } });

        if (!scan) {
            res.status(400).json({ error: "Please scan RFID first" });
        }

        const newDataKamera = {
            panjang: payload.panjang,
            tinggi: payload.tinggi,
            chip_id: scan.chip_id,
            sensor_id: sensor.id,
            createdAt: currentDate,
            updatedAt: currentDate
        };

        if (!scan.is_paired) {
            const datadomba = await orm.dataDombaPeriode.findFirst({ orderBy: { id: "desc" } });
            const newKamera = await orm.kamera.create({ data: newDataKamera });

            if (!datadomba) { // if datadomba empty then create new
                const newDatadombaBody = {
                    chip_id: scan.chip_id,
                    kamera_id: newKamera.id,
                    createdAt: currentDate,
                    updatedAt: currentDate
                };

                const newDatadomba = await orm.dataDombaPeriode.create({ data: newDatadombaBody });
                return res.status(200).json({
                    message: "success",
                    data: newDatadomba
                });
            } else if (datadomba.kamera_id !== null && datadomba.loadcell_badan_id !== null && datadomba.chip_id !== null) { // if complete then create new

                const newDatadombaBody = {
                    chip_id: scan.chip_id,
                    kamera_id: newKamera.id,
                    createdAt: currentDate,
                    updatedAt: currentDate
                };

                const updateRFIDStatus = await orm.rFID.update({ where: { id: scan.id }, data: { is_paired: true } });
                const newDatadomba = await orm.dataDombaPeriode.create({ data: newDatadombaBody });
                return res.status(200).json({
                    message: "success",
                    data: {
                        newKamera,
                        newDatadomba
                    }
                });
            } else { // if incomplete then update column
                const newDatadombaBody = {
                    chip_id: scan.chip_id,
                    kamera_id: newKamera.id,
                    updatedAt: currentDate
                };

                const updateDatadomba = await orm.dataDombaPeriode.update({ where: { id: datadomba.id }, data: newDatadombaBody });


                return res.status(200).json({
                    message: "success",
                    data: {
                        newKamera,
                        updateDatadomba
                    }
                });
            }
        } else {
            res.status(500).json({ error: "RFID is already paired" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// show / menampilkan data berdasarkan id   
const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rec = await orm.kamera.findUnique({ where: { id: Number(id) } , include : {chip : true}});
        if (!rec) {
            return res.status(404).json({ message: "Data not found" });
        };

        const data = {
            id : rec.id,
            panjang : parseFloat(rec.panjang),
            tinggi : parseFloat(rec.tinggi),
            createdAt : rec.createdAt,
            updatedAt : rec.updatedAt,
            chip_id : rec.chip_id,
            nama_domba : rec.chip.nama_domba,
            jenis_kelamin : rec.chip.jenis_kelamin

        };

        return res.status(200).json({
            message: "success",
            data
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// update / memperbarui data berdasarkan id
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const time = Date.now();
        const currentDate = new Date(time).toISOString();
        const old = await orm.kamera.findUnique({ where: { id: Number(id) } });

        const newBody = {
            panjang: payload.panjang,
            tinggi: payload.tinggi,
            updatedAt: currentDate
        };

        const update = await orm.kamera.update({
            where: { id: Number(id) },
            data: newBody,
        });

        const { DECIMAL: oldDecimal, STRING: oldString, paired: oldPaired, ...oldData } = old;
        const { DECIMAL: newDecimal, STRING: newString, paired: newPaired, ...updatedData } = update;

        return res.status(200).json({
            message: "success",
            updatedData,
            oldData
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// destroy / menghapus data berdasarkan id
const destroy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await orm.kamera.delete({ where: { id: Number(id) } });
        return res.status(200).json({
            message: "success"
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export default {
    index,
    graph,
    show,
    create,
    update,
    destroy
}