import { PrismaClient } from "@prisma/client";
import moment from "moment-timezone";

const orm = new PrismaClient();

// index / menampilkan semua data
const index = async (req, res, next) => {
    try {
        const page = Number(req.query.page) ? Number(req.query.page) - 1 : 0;
        const row_count = await orm.loadcellBadan.count();
        const offset = page * 5;

        const rec = await orm.loadcellBadan.findMany({
            orderBy: { id: "desc" },
            skip: offset,
            take: 5,
            select: {
                id: true,
                berat: true,
                createdAt: true,
                updatedAt: true,
                chip: {
                    select: {
                        id: true,
                        nama_domba: true,
                        jenis_kelamin: true,
                    }
                }
            }
        });

        const formattedData = rec.map(data => ({
            id: data.id,
            berat: parseFloat(data.berat),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            chip_id: data.chip.id,
            nama_domba: data.chip.nama_domba,
            jenis_kelamin: data.chip.jenis_kelamin
        }));

        return res.status(200).json({
            message: "success",
            pagination: {
                totalPages: Math.ceil(Number(row_count) / 5),
                currentPage: page + 1
            },
            data: {
                count: row_count,
                rows: formattedData,
            }
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// graph / menampilkan data terbaru untuk grafik
const graph = async (req, res, next) => {
    try {
        const { chip_id } = req.query;
        const page = Number(req.query.page) ? Number(req.query.page) - 1 : 0;
        const row_count = await orm.loadcellBadan.count({ where: { chip_id: chip_id } });
        const offset = page * 5;

        const rec = await orm.domba.findMany({
            where: { id: chip_id },
            select: {
                id: true,
                loadcellBadan: {
                    orderBy: { id: "desc" },
                    skip: offset,
                    take: 5,
                    select: {
                        id: true,
                        berat: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        });

        const formattedData = rec.flatMap(data =>
            data.loadcellBadan.map(loadcellBadan => ({
                id: loadcellBadan.id,
                berat: parseFloat(loadcellBadan.berat),
                createdAt: loadcellBadan.createdAt,
                updatedAt: loadcellBadan.updatedAt,
                chip_id: data.id
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
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// show / menampilkan data berdasarkan id
const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rec = await orm.loadcellBadan.findUnique({
            where: { id: Number(id) },
            include: { chip: true }
        });

        const data = {
            id: rec.id,
            berat: parseFloat(rec.berat),
            createdAt: rec.createdAt,
            updatedAt: rec.updatedAt,
            chip_id: rec.chip_id,
            nama_domba: rec.chip.nama_domba,
            jenis_kelamin: rec.chip.jenis_kelamin
        };

        return res.status(200).json({
            message: "success",
            data
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// create / membuat data berat badan baru
const create = async (req, res, next) => {
    try {
        const payload = req.body;
        const time = Date.now();
        const currentDate = new Date(time).toISOString();
        const loadcellBadan = await orm.sensor.findFirst({ where: { nama_sensor: "loadcell badan" }, select: { id: true } });

        const scan = await orm.rFID.findFirst({ orderBy: { id: "desc" } });

        const newBody = {
            berat: payload.berat,
            chip_id: scan.chip_id,
            sensor_id: loadcellBadan.id,
            createdAt: currentDate,
            updatedAt: currentDate,
        };

        if (!scan.is_paired) { // check if rfid is already paired
            const datadomba = await orm.dataDombaPeriode.findFirst({ orderBy: { id: "desc" } });

            const newLoadcellBadan = await orm.loadcellBadan.create({ data: newBody });

            if (!datadomba) { // if datadomba empty then create new
                const newDatadombaBody = {
                    chip_id: scan.chip_id,
                    loadcell_badan_id: newLoadcellBadan.id,
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
                    loadcell_badan_id: newLoadcellBadan.id,
                    createdAt: currentDate,
                    updatedAt: currentDate
                };

                await orm.rFID.update({ where: { id: scan.id }, data: { is_paired: true } });
                const newDatadomba = await orm.dataDombaPeriode.create({ data: newDatadombaBody });
                return res.status(200).json({
                    message: "success",
                    data: {
                        newLoadcellBadan,
                        newDatadomba
                    }
                });
            } else { // if incomplete then update column
                const newDatadombaBody = {
                    chip_id: scan.chip_id,
                    loadcell_badan_id: newLoadcellBadan.id,
                    updatedAt: currentDate
                };

                const updateDatadomba = await orm.dataDombaPeriode.update({ where: { id: datadomba.id }, data: newDatadombaBody });

                return res.status(200).json({
                    message: "success",
                    data: {
                        newLoadcellBadan,
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

// update / memperbarui data berat badan
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const time = Date.now();
        const currentDate = new Date(time).toISOString();
        const old = await orm.loadcellBadan.findUnique({ where: { id: Number(id) } });

        const updatedBody = {
            berat: payload.berat,
            updatedAt: currentDate,
        };

        const update = await orm.loadcellBadan.update({
            where: { id: Number(id) },
            data: updatedBody
        });

        const { paired: oldPaired, ...oldData } = old;
        const { paired: newPaired, ...updatedData } = update;

        return res.status(200).json({
            message: "success",
            updatedData,
            oldData
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// destroy / menghapus data berdasarkan id
const destroy = async (req, res, next) => {
    try {
        const { id } = req.params;
        await orm.loadcellBadan.delete({ where: { id: Number(id) } });

        return res.status(200).json({
            message: "success",
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// getDailyData / menampilkan 5 data terakhir di hari yang dipilih
const getDailyData = async (req, res, next) => {
    try {
        const { date, chip_id } = req.params;
        const targetDate = new Date(date);

        // Define the start and end times for the selected date
        const startDate = new Date(targetDate);
        startDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00
        const endDate = new Date(targetDate);
        endDate.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59

        const response = await orm.loadcellBadan.findMany({
            where: {
                chip_id: chip_id,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { createdAt: 'desc' }, // Order by createdAt in descending order
            take: 5
        });

        let formattedData = response.map(record => ({
            id: record.id,
            berat: parseFloat(record.berat),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            chip_id: record.chip_id,
        }));

        // If no data found, add a record with 0 value
        if (formattedData.length === 0) {
            formattedData = [{
                id: '0',
                berat: 0.0,
                createdAt: startDate,
                updatedAt: startDate,
                chip_id: chip_id,
            }];
        }
        // Ensure only the last 5 records are returned
        if (formattedData.length > 5) {
            formattedData = formattedData.slice(0, 5);
        }

        console.log('Daily Data berat badan:', formattedData);
        res.status(200).json({ data: formattedData });
    } catch (e) {
        console.error('Error fetching daily data:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getWeeklyData = async (req, res, next) => {
    try {
        const { date, chip_id } = req.params;
        const targetDate = new Date(date);

        // Define the start and end dates for the week centered around the selected date
        const startDate = new Date(targetDate);
        startDate.setUTCDate(startDate.getUTCDate() - 3); // 3 days before the selected date
        startDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00

        const endDate = new Date(targetDate);
        endDate.setUTCDate(endDate.getUTCDate() + 3); // 3 days after the selected date
        endDate.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59

        const response = await orm.loadcellBadan.findMany({
            where: {
                chip_id: chip_id,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { createdAt: 'asc' }, // Order by createdAt in ascending order
        });

        // Calculate the average values for each day
        const dailyData = {};
        response.forEach(record => {
            const date = record.createdAt.toISOString().split('T')[0];
            if (!dailyData[date]) {
                dailyData[date] = { sum: 0, count: 0 };
            }
            dailyData[date].sum += parseFloat(record.berat);
            dailyData[date].count += 1;
        });

        const formattedData = [];
        for (let i = -3; i <= 3; i++) {
            const date = new Date(targetDate);
            date.setUTCDate(date.getUTCDate() + i);
            const dateString = date.toISOString().split('T')[0];
            if (dailyData[dateString]) {
                formattedData.push({
                    date: dateString,
                    averageBerat: (dailyData[dateString].sum / dailyData[dateString].count).toFixed(2),
                });
            } else {
                formattedData.push({
                    date: dateString,
                    averageBerat: '0.00',
                });
            }
        }

        console.log('Weekly Data:', formattedData);
        res.status(200).json({ data: formattedData });
    } catch (e) {
        console.error('Error fetching weekly data:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// getMonthlyData / menampilkan data bulanan    
const getMonthlyData = async (req, res, next) => {
    try {
        const { date, chip_id } = req.params;
        const target_time = new Date(date);

        // Define the start and end dates for each week of the month
        const endDate = new Date(target_time.getFullYear(), target_time.getMonth() + 1, 0).getDate(); // Last day of the month
        const weeks = [
            { start: new Date(target_time.getFullYear(), target_time.getMonth(), 1, 0, 0, 0), end: new Date(target_time.getFullYear(), target_time.getMonth(), 7, 23, 59, 59) },
            { start: new Date(target_time.getFullYear(), target_time.getMonth(), 8, 0, 0, 0), end: new Date(target_time.getFullYear(), target_time.getMonth(), 15, 23, 59, 59) },
            { start: new Date(target_time.getFullYear(), target_time.getMonth(), 16, 0, 0, 0), end: new Date(target_time.getFullYear(), target_time.getMonth(), 22, 23, 59, 59) },
            { start: new Date(target_time.getFullYear(), target_time.getMonth(), 23, 0, 0, 0), end: new Date(target_time.getFullYear(), target_time.getMonth(), endDate, 23, 59, 59) },
        ];

        const averages = await Promise.all(weeks.map(async (week, index) => {
            console.log(`Querying records for week ${index + 1}: From ${week.start} to ${week.end}`);

            const records = await orm.loadcellBadan.findMany({
                where: {
                    chip_id: chip_id,
                    createdAt: {
                        gte: week.start,
                        lte: week.end,
                    }
                }
            });

            console.log(`Week ${index + 1}: Records found - ${records.length}`); // Log number of records
            console.log(`Records data:`, records); // Log actual records for debugging

            if (records.length === 0) {
                return { week: index + 1, avgBerat: 0 }; // No data for this week, set avgBerat to 0
            }

            const totalBerat = records.reduce((sum, record) => {
                const beratValue = parseFloat(record.berat); // Convert to float
                if (!isNaN(beratValue)) {
                    return sum + beratValue; // Only add if valid number
                }
                return sum; // Ignore invalid entries
            }, 0);

            const avgBerat = records.length > 0 ? totalBerat / records.length : 0; // Calculate average

            console.log(`Week ${index + 1}: Total Weight = ${totalBerat}, Average Weight = ${avgBerat.toFixed(2)}`); // Log total and average weights

            return { week: index + 1, avgBerat }; // Return week number and average
        }));

        // Prepare the final response with the averages
        const response = averages.map(avg => ({
            week: avg.week,
            avgBerat: avg.avgBerat.toFixed(2), // Keep the original key name for consistency
        }));

        // Log the final average response
        console.log('Final average values:', response);

        res.status(200).json({ averageValues: response });
    } catch (e) {
        console.error('Error fetching monthly data:', e); // Log error for debugging
        res.status(500).json({ error: e.message });
    }
};

export default {
    index,
    show,
    create,
    update,
    destroy,
    graph,
    getDailyData,
    getWeeklyData,
    getMonthlyData
};