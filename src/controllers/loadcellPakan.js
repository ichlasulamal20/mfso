import { PrismaClient } from "@prisma/client";
import moment from "moment-timezone";

const orm = new PrismaClient();
// index / menampilkan semua data
const index = async (req, res, next) => {
    try {
        const page = Number(req.query.page) ? Number(req.query.page) - 1 : 0;
        const row_count = await orm.loadcellPakan.count();
        const offset = page * 5;

        // const data = await orm.loadcellPakan.findMany({skip: offset, take: 5});
        const rec = await orm.loadcellPakan.findMany({
            orderBy: { id: "desc" },
            skip: offset, take: 5,
            select: {
                id: true,
                berat_pakan: true,
                createdAt: true,
                updatedAt: true,
                chip : {
                    select : {
                        id : true,
                        nama_domba : true,
                        jenis_kelamin : true
                    }
                }
            }
        });

        const formattedData = rec.map(data => {
            return {
                id : data.id,
                berat_pakan : parseFloat(data.berat_pakan),
                createdAt : data.createdAt,
                updatedAt : data.updatedAt,
                chip_id : data.chip.id,
                nama_domba : data.chip.nama_domba,
                jenis_kelamin : data.chip.jenis_kelamin
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
}



// graph / menampilkan data terbaru untuk grafik
const graph = async (req, res, next) => {
    try {
        const chip_id = req.query;
        const page = Number(req.query.page) ? Number(req.query.page) - 1: 0;
        const row_count = await orm.loadcellPakan.count({where : {chip_id : chip_id}});
        const offset = page * 5;

        const rec = await orm.domba.findMany({
            where: { id: chip_id },
            select: {
                id: true,
                loadcellPakan: {
                    orderBy: { id: "desc" },
                    skip: offset, take: 5,
                    select: {   
                        id: true,
                        berat_pakan: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                }
            }
        });

        const formattedData = rec.flatMap(data =>
            data.loadcellPakan.map(loadcellPakan => ({
                id: loadcellPakan.id,
                berat_pakan: parseFloat(loadcellPakan.berat_pakan),
                createdAt: loadcellPakan.createdAt,
                updatedAt: loadcellPakan.updatedAt,
                chip_id: data.id,
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
}



// show / menampilkan data berdasarkna id
const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rec = await orm.loadcellPakan.findUnique({ where: { id: Number(id) }, include  : {chip : true} });

        const data = {
            id: rec.id,
            berat_pakan: parseFloat(rec.berat_pakan),
            createdAt: rec.createdAt,
            updatedAt: rec.updatedAt,
            chip_id : rec.chip_id,
            nama_domba : rec.chip.nama_domba,
            jenis_kelamin : rec.chip.jenis_kelamin
        }

        return res.status(200).json({
            message: "success",
            data
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


// membuat data berat pakan baru
const create = async (req, res, next) => {
    try {
        
        const payload = req.body;
        // console.log(payload);
        const currentDate = moment.utc().toISOString();
        const dateRe = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
        const loadcellPakan = await orm.sensor.findFirst({ where: { nama_sensor: "loadcell pakan" }, select: { id: true } });

        const newBody = {
            berat_pakan: payload.berat,
            chip_id: payload.chip_id,
            sensor_id: loadcellPakan.id,
            createdAt: currentDate,
            updatedAt: currentDate,
        };

        const data = await orm.loadcellPakan.create({ data: newBody });
        return res.status(200).json({
            message: "success",
            data
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// membuat data berat badan baru
const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const currentDate = moment().tz("Asia/Jakarta").toISOString(); // Use the current date and time in Jakarta timezone
        const loadcellPakan = await orm.sensor.findFirst({ where: { nama_sensor: "loadcell pakan" }, select: { id: true } });

        const updatedBody = {
            berat_pakan: payload.berat,
            chip_id: payload.chip_id,
            sensor_id: loadcellPakan.id,
            updatedAt: currentDate,
        }

        const data = await orm.loadcellPakan.update({
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
        await orm.loadcellPakan.delete({ where: { id: Number(id) } });

        return res.status(200).json({
            message: "success",
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

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

        const response = await orm.loadcellPakan.findMany({
            where: {
                chip_id: chip_id,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { createdAt: 'desc' }, // Order by createdAt in descending order
            take: 5, // Take the last 5 data points
        });

        if (response.length === 0) {
            console.log('No data found');
            return res.status(404).json({ error: 'No data found' });
        }

        const formattedData = response.map(record => ({
            id: record.id,
            berat_pakan: parseFloat(record.berat_pakan),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            chip_id: record.chip_id,
        }));

        console.log('Daily Data berat pakan:', formattedData);
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

        const response = await orm.loadcellPakan.findMany({
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
            dailyData[date].sum += parseFloat(record.berat_pakan);
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
                    averagePakan: (dailyData[dateString].sum / dailyData[dateString].count).toFixed(2),
                });
            } else {
                formattedData.push({
                    date: dateString,
                    averagePakan: '0.00',
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

            const records = await orm.loadcellPakan.findMany({
                where: {
                    chip_id: chip_id,
                    createdAt: {        
                        gte: week.start,
                        lte: week.end,
                    }
                }
            });


            if (records.length === 0) {
                return { week: index + 1, avgBeratPakan: 0 }; // No data for this week, set avgBeratPakan to 0
            }

            const totalBeratPakan = records.reduce((sum, record) => {
                const beratPakanValue = parseFloat(record.berat_pakan); // Convert to float
                if (!isNaN(beratPakanValue)) {
                    return sum + beratPakanValue; // Only add if valid number
                }
                return sum; // Ignore invalid entries
            }, 0);

            const avgBeratPakan = records.length > 0 ? totalBeratPakan / records.length : 0; // Calculate average

            return { week: index + 1, avgBeratPakan }; // Return week number and average
        }));

        // Prepare the final response with the averages
        const response = averages.map(avg => ({
            week: avg.week,
            avgBeratPakan: avg.avgBeratPakan.toFixed(3), // Keep the original key name for consistency
        }));

        // Log the final average response
        console.log('Monthly Data:', response);
        res.status(200).json({ averageValues: response });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
  
export default {
    index,
    graph,
    show,
    create,
    update,
    destroy,
    getDailyData,
    getWeeklyData,
    getMonthlyData
}